class app($node_version = "v0.10.26") {
    # Add some default path values
    Exec { path => ['/usr/local/bin','/usr/local/sbin','/usr/bin/','/usr/sbin','/bin','/sbin', "/home/vagrant/nvm/${node_version}/bin"], }

    # Base packages and ruby gems (sass, compass)
    class { essentials: }

    class { nginx:
        require => [Class["essentials"]]
    }

    # Install node through NVM
    class { 'nvm':
        node_version => $node_version,
        require => [Class["essentials"]]
    }->
    exec { "set-up-sudo-node-pt-1":
      cwd     => "/home/vagrant",
      command => "echo 'alias node=\$NVM_BIN/node' >> /home/vagrant/nvm/nvm.sh",
      unless  => "grep 'alias node=\$NVM_BIN/node' /home/vagrant/nvm/nvm.sh",
    }->
    exec { "set-up-sudo-node-pt-2":
      cwd     => "/home/vagrant",
      command => "echo 'alias sudo=\"sudo \"' >> /home/vagrant/.bashrc",
      unless  => "grep 'alias sudo=\"sudo \"' /home/vagrant/.bashrc",
    }

    class { upstart:
        node_version => $node_version,
        require => [Class["essentials"], Class['nvm'], Exec['set-up-sudo-node-pt-1'], Exec['set-up-sudo-node-pt-2'], Exec['install-nodemon-npm-package']],
    }

    # This function depends on some commands in the nvm.pp file
    define npm( $directory="/home/vagrant/nvm/${app::node_version}/lib/node_modules" ) {
      exec { "install-${name}-npm-package":
        unless  => "test -d ${directory}/${name}",
        command => "npm install -g ${name}",
        require => Exec['install-node'],
      }
    }


    # Global npm modules
    npm { ["grunt-cli",
           "db-migrate",
           "nodemon",
           "pg"]:
    }

    # Examples of installing packages from a package.json if we need to.
    exec { "npm-install-packages":
      cwd => "/vagrant",
      command => "npm install",
      require => Exec['install-node'],
    }

    class{ 'postgresql::globals':
      version               => '9.3',
      manage_package_repo   => true,
    }->
    class { 'postgresql::server':
      ip_mask_allow_all_users    => '0.0.0.0/0',
      ip_mask_deny_postgres_user => '0.0.0.0/32',
      listen_addresses           => '*',
      postgres_password          => 'postgres',
    }->
    class { 'postgresql::lib::devel': }

    postgresql::server::role { 'vagrant':
      password_hash => postgresql_password('vagrant', 'postgres')
    }

    # make sure the database exists
    postgresql::server::db { 'setlister-dev':
      user     => 'vagrant',
      password => postgresql_password('vagrant', 'postgres')
    }-> # run migrations on database
    exec { "run-migrations":
      cwd     => "/vagrant",
      path    => "/home/vagrant/nvm/${node_version}/bin",
      command => "/home/vagrant/nvm/${node_version}/bin/db-migrate up -m api/migrations",
      require => [Exec['install-db-migrate-npm-package'], Exec['install-pg-npm-package']],
    }

    exec { "add-to-bashrc":
      cwd     => "/home/vagrant",
      command => "echo 'cd /vagrant' >> /home/vagrant/.bashrc",
      unless  => "grep 'cd /vagrant' /home/vagrant/.bashrc",
    }
}

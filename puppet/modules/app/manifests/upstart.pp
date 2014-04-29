class upstart ($node_version) {

    file { "app-conf":
        ensure  => file,
        path => "/etc/init/app.conf",
        content => template("app/config/app.conf")
    }

    service { 'app':
        ensure   => running,
        provider => 'upstart',
        require  => File['app-conf'],
    }

    file { "web-conf":
        ensure  => file,
        path => "/etc/init/web.conf",
        content => template("app/config/web.conf")
    }

    service { 'web':
        ensure   => running,
        provider => 'upstart',
        require  => File['web-conf'],
    }

}

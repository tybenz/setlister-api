# Take from openbadges setup.

class essentials {
  group { "puppet" :
    ensure => present,
    name => "puppet";
  }

  Package { ensure => installed }

  package {
    ["curl",
    "libssl-dev",
    "git-core",
    "python",
    "build-essential"
    ]:
  }
}

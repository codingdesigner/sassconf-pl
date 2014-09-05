#!/bin/bash
cd `dirname $0`
cd .. # in repo root

echo ""
echo "# Git Setup"

# Setup Git Hooks
echo "Linking files in \"scripts/git-hooks/\" in as git hooks in \".git/hooks/\" to help with compiled assets merging."
chmod +x scripts/* # ensure all scripts are executable
cd .git/ # must run linking here. fails from repo root.
rm -r hooks
ln -sf ../scripts/git-hooks hooks
chmod +x hooks/*

# Setup Git Config
if [[ "$(cat config | grep -c '\[merge "ours"\]')" == "0" ]]; then # Make sure .git/config hasn't had this added yet; if not then add it.
    echo "" >> config # ensure new line
    echo '[merge "ours"]' >> config
    echo "  name = \"Keep ours merge\"" >> config
	  echo "  driver = true" >> config
fi

# Setup Git Flow via Homebrew settings
if [[ "$(cat config | grep -c '\[gitflow')" == "0" ]]; then
    echo ''
    echo '[gitflow "branch"]' >> config
    echo '  master = master' >> config
    echo '  develop = dev' >> config
    echo '[gitflow "prefix"]' >> config
    echo '  feature = feature--' >> config
    echo '  release = release--' >> config
    echo '  hotfix = hotfix--' >> config
    echo '  support = support--' >> config
    echo '  versiontag = v--' >> config
fi
cd ..
echo "Done setting up git"

# Ruby installs
if [[ -a "`which gem`" ]]; then
  echo ""
  echo "# Installing/Updating Bundler Ruby Gem"
  gem install bundler
  echo ""
  echo "# Installing other Gems via Bundler to ensure version parity between developers"
  bundle install
else
  echo "# ERROR: You need to have the command \"gem\" : install and try again: http://rubygems.org/pages/download"
  exit 1
fi

# Node installs
if [[ -a "`which npm`" ]]; then
  echo ""
#  echo "# Making sure we own ~/.npm so we can install packages without sudo later"
#  sudo chown -R `whoami` ~/.npm
  echo "# Installing Grunt CLI for easy task execution"
#  echo "We will need your admin password to install the grunt-cli"
#  npm install grunt-cli
  echo ""
  echo "# Installing Grunt Dependencies via node.js"
  npm install
  if [[ "`cat ~/.bash_profile | grep -c "grunt --completion"`" == "0" ]]; then
    echo 'eval "$(grunt --completion=bash)"' >> ~/.bash_profile
  fi
  echo "# Installing bower components"
  bower install
else
  echo "# ERROR: You need to have node.js and the \"npm\" command installed. Get it here and try again: http://nodejs.org/download/"
  exit 1
fi

# Homebrew installs
if [[ -a "`which brew`" ]]; then
  echo ""
  echo "# Installing Git Flow command line helper via Homebrew. Type \"git flow help\" for info."
  brew install git-flow
  git checkout master
  git checkout dev
  git flow init
#  echo "Installing stuff for creating font icons from SVGs"
#  brew install ttfautohint --with-python
else
  echo ""
  echo "No Homebrew installed; oh well, it was just some nice to haves..."
#  echo "If you would like to be able to easily add to the font icons by adding SVGs; then install this: http://www.freetype.org/ttfautohint/#download"
#  echo "Install it now if you want; but it is only needed if you want to add new icons - hit enter when you are ready"
#  read pause
fi

# Linux installs with `yum` package installer
if [[ -a "`which yum`" ]]; then
  echo "You are on Linux! Custom installs using yum can be added to the setup script, but have not yet..."
fi

# Linux installs with `apt-get` package installer
if [[ -a "`which apt-get`" ]]; then
  echo "You are on Linux! Custom installs using apt-get can be added to the setup script, but have not yet..."
fi

echo ""
echo "# Building Site"
grunt build
echo ""
echo "# Sass is compiled and Pattern Lab is built."

echo ""
echo "# All done! Go ahead and type \"grunt\" to kick off a full dev experience:"
echo "Sass/Compass Watch, Pattern Lab Watch, and Browser Auto Reload."
echo "Read the readme for more info"
echo "Enjoy!"

#echo ""
#echo "# Kicking off Grunt for you..."
#echo ""
#echo "grunt"
#grunt
#echo ""
#echo 'Just type "grunt" to kick that off again next time.'

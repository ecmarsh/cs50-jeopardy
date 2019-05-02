import React from 'react';
import Link from 'next/link';
import User from '../User';
import Signout from '../Signout';
import NavBar from '../styles/NavBar';
import toTitleCase from '../../lib/toTitleCase';

function Nav(props) {
  const adminLinks = [
    { path: '/', label: 'My Games' },
    //{ path: '/start', label: 'Create Game' },
  ];
  const userLinks = [
    { path: '/submit', label: 'Contribute' },
    { path: '/study', label: 'Play' },
    { path: '/review', label: 'Review' },
  ];

  const noUserLinks = [
    { path: '/signin', label: 'Sign In' },
    { path: '/signup', label: 'Create Account' },
  ];

  return (
    <User>
      {({ data: { me } }) => {
        return (
          <NavBar>
            <div data-test="nav">
              {me && (
                <nav className=".nav-bg">
                  <h4 data-test="nav-username">{toTitleCase(me.name)}</h4>
                  {me.permissions.includes('PERMISSIONUPDATE') && (
                    <Link href="permissions">
                      <a>Permissions</a>
                    </Link>
                  )}
                  {me.permissions.includes('ADMIN') &&
                    adminLinks.map((link, i) => (
                      <Link key={`adminLink-${i}`} href={link.path}>
                        <a>{link.label}</a>
                      </Link>
                    ))}
                  {userLinks.map((link, i) => (
                    <Link key={`userLink-${i}`} href={link.path}>
                      <a>{link.label}</a>
                    </Link>
                  ))}
                  <Signout />
                </nav>
              )}
              {!me && (
                <nav>
                  {noUserLinks.map((link, i) => (
                    <Link key={`noUserLink-${i}`} href={link.path}>
                      <a>{link.label}</a>
                    </Link>
                  ))}
                </nav>
              )}
            </div>
          </NavBar>
        );
      }}
    </User>
  );
}

export default Nav;

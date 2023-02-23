![](icon.svg)
# Budibase LDAP

## Description
A datasource plugin for Budibase to perform LDAP Directory queries.

**Please note: Add, Update, Delete queries have not been tested**

Find out more about [Budibase](https://github.com/Budibase/budibase).

# How To Use
1. Import the plugin into your budibase instance (see Budibase documentation for more info)

2. Add the LDAP datasource to your application

3. Enter your LDAP servers host (inlcuding protocol (ldap:// or ldaps://) in the HOST field)

4. Enter the port number

5. Enter the distinguished name and password of a user with appropriate privileges for the queries you'll be executing

## Local Build Instructions

To build your new  plugin run the following in your Budibase CLI:
```
budi plugins --build
```

You can also re-build everytime you make a change to your plugin with the command:
```
budi plugins --watch
```

<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', 'root' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '~u7WKhuN;QQq(5c-,Ob+$zJ /D2HQ:Qrhn&Qvhr-h$aki-Wc*T :xF]FE3/16E>H' );
define( 'SECURE_AUTH_KEY',   'TA7cCy<6g@GL~2T@w#>pHBKCfK=!Y[#fj+d&`YPu0MIBJ-5OXxk?)A4=>J+uv~>L' );
define( 'LOGGED_IN_KEY',     ',-Q ::Nn!iKG(|r#zX~n[aqGbo[jQbpCqUY.&}@K&s|VK48ohwpsKd*J^ZeG`CmL' );
define( 'NONCE_KEY',         'NqU+BwH^uD0$`%P<:)G%,$1@<3WT}z:P06LK7^+B`N[m^EO{~wU6y:pmV|r!Q:||' );
define( 'AUTH_SALT',         '+el5q9s2Ub)}<HpNn!?IfEV36h=P :.Zq~,KxHv>Z#*g[x6Vw4@wJ@yyK,q%j`5|' );
define( 'SECURE_AUTH_SALT',  'mYO4v{;Wl];edK#(DKyL@89+.0,4oA@!<nFO`),}-7NB[%J2F,J`J?A;p@@^KWxF' );
define( 'LOGGED_IN_SALT',    '>;g:hpeg?>Wn}Qg(>@QHFg=vUM&8_1!]^bI$o,f~&s.(,niyb?`%?BOS>TBq^1}H' );
define( 'NONCE_SALT',        'zitp{p,bU+K/`?5!#N:S*.*=1AeD<6q:8geuR04j[,:~EWMbj9*Sb+OVt[DfXa_3' );
define( 'WP_CACHE_KEY_SALT', '~9 |xSJD9]]c qF4OQuEsfv]njZ<~VOV(X!!h2rNh:K(eL_q5*g&sMgOPE-BL$4d' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', true );
	define( 'SCRIPT_DEBUG', true );
	define( 'WP_DEBUG_LOG', true );
}

define( 'WP_ENVIRONMENT_TYPE', 'local' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

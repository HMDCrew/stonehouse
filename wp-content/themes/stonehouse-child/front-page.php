<?php
/**
 * The template for display front page
 *
 * This is the template that display front page by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site may use a
 * different template.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Asta
 */

get_header();
?>

	<main id="primary" class="site-main">

		<div class="container">
			<?php
			while ( have_posts() ) :
				the_post();

				get_template_part( 'template-parts/content', 'front' );

			endwhile; // End of the loop.
			?>

			<div class="maps">
				<div id="stonemap"></div>
				<div id="mini-map"></div>
				<!-- <div id="houses">
					<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="30px" width="30px" version="1.1" viewBox="0 0 281.067 281.067">
						<path style="fill:#a3a3a3;" d="M72.718,44.346L9.684,123.308C8.27,125.08,7.5,127.28,7.5,129.547v110.936h46.924v-42.219 c0-5.523,4.477-10,10-10h32.219c5.523,0,10,4.477,10,10v42.219h46.924V129.547c0-2.267-0.77-4.467-2.185-6.239L88.348,44.346 C84.345,39.331,76.721,39.331,72.718,44.346z"/>
						<path style="fill:#d1d1d1;" d="M211.382,123.308l-63.034-78.962c-4.003-5.015-11.627-5.015-15.63,0l-22.185,27.791l40.849,51.171 c1.414,1.772,2.185,3.972,2.185,6.239c0,11.136,0,99.73,0,110.937c6.084,0,53.248,0,60,0V129.547 C213.567,127.28,212.796,125.08,211.382,123.308z"/>
						<path style="fill:#FFFFFF;" d="M271.382,123.308l-63.034-78.962c-4.003-5.015-11.627-5.015-15.63,0l-22.185,27.791l40.849,51.171 c1.414,1.772,2.185,3.972,2.185,6.239c0,11.136,0,99.73,0,110.936c6.084,0,53.248,0,60,0V129.547 C273.567,127.28,272.796,125.08,271.382,123.308z"/>
						<path style="fill:#3d3d3d;" d="M277.242,118.628l0.001,0.001L214.21,39.667c-7.015-8.786-20.353-8.768-27.354,0l-16.323,20.448 L154.21,39.667c-7.015-8.786-20.353-8.768-27.354,0l-16.323,20.448L94.21,39.667c-7.015-8.786-20.353-8.768-27.354,0 L3.824,118.628C1.358,121.716,0,125.594,0,129.547v110.937c0,4.142,3.357,7.5,7.5,7.5h46.924c4.143,0,7.5-3.358,7.5-7.5v-42.219 c0-1.378,1.121-2.5,2.5-2.5h32.219c1.379,0,2.5,1.122,2.5,2.5v42.219c0,4.142,3.357,7.5,7.5,7.5c15.24,0,151.662,0,166.925,0 c4.143,0,7.5-3.358,7.5-7.5V129.547C281.067,125.594,279.709,121.717,277.242,118.628z M146.066,232.983h-31.924v-34.719 c0-9.649-7.851-17.5-17.5-17.5H64.424c-9.649,0-17.5,7.851-17.5,17.5v34.719H15V129.547c0-0.565,0.193-1.119,0.546-1.56 l63.033-78.962c1.002-1.255,2.906-1.255,3.908,0l22.183,27.789c0.001,0.001,0.001,0.002,0.002,0.002l40.85,51.172 c0.311,0.39,0.545,0.974,0.545,1.559V232.983z M157.243,118.629L120.13,72.137l18.449-23.112c1.002-1.255,2.906-1.255,3.908,0 l22.183,27.789c0.001,0.001,0.001,0.001,0.002,0.002l23.274,29.155l17.575,22.016c0,0,0,0.001,0.001,0.001 c0.352,0.441,0.546,0.995,0.546,1.559v103.437h-45V129.547C161.067,125.594,159.709,121.717,157.243,118.629z M266.067,232.983 h-45V129.547c0-3.968-1.368-7.843-3.824-10.918L180.13,72.137l18.449-23.112c1.002-1.255,2.906-1.255,3.908,0l63.033,78.962 c0,0,0,0.001,0.001,0.001c0.351,0.441,0.546,0.995,0.546,1.559V232.983z"/>
					</svg>
				</div> -->
			</div>
		</div>
	</main><!-- #main -->

<?php
get_footer();
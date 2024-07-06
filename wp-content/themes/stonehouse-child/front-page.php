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
				<div class="map">
					<div id="stonemap"></div>
					<div id="mini-map"></div>
				</div>
				<div class="details">

					<?php foreach ( stonehouse_get_locations() as $post ) : ?>

						<?php get_template_part( 'template-parts/house', 'item', $post ); ?>

					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</main><!-- #main -->

	<!--
	<form action="https://geodati.gov.it/geoportale/templates/rndt/advancedSearch//services-advancedSearch.php" method="POST">

		<input type="text" style="width: 100%;" value="http://192.168.3.30:8080/geoportalRNDTPA/rest/find/document?start=1&max=15&geometryType=esriGeometryBox&searchText=apiso.Type:(dataset OR series)&spatialRel=all&f=json" name="GPT_REST_URL_SERVER" />
		<input type="text" style="width: 100%;" value="http://192.168.3.30:8080/geoportalRNDTPA/rest/find/document" name="url" />

		<button type="submit">submit</button>
	</form>
	-->
<?php
get_footer();
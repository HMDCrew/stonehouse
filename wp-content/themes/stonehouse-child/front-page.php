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
				<div class="housed">
					<?php
						$houses = new WP_Query(
							array(
								'post_type'   => 'house',
								'author' 	  => get_current_user_id(),
								'post_status' => array('publish', 'pending', 'draft', 'future', 'private', 'inherit', 'trash')    
							)
						);

						if ( ! empty( $houses->posts ) ) {

							foreach ( $houses->posts as $post ) {

								get_template_part( 'template-parts/house', 'item', array(
										'house' => $post, 
										'location' => get_post_meta( $post->ID , 'location', true )
									) 
								);
							}
						}
					?>
				</div>
			</div>
		</div>
	</main><!-- #main -->

<?php
get_footer();
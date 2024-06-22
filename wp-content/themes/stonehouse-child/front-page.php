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

								// var_dump( get_post_meta( $post->ID , 'location', true ) );

								$location = get_post_meta( $post->ID , 'location', true );
								?>

								<div class="house" house-id="<?php echo $post->ID; ?>">
									<div class="info">
										<div class="title"><?php echo $post->post_title; ?></div>
										<div class="location">
											<div class="lat">lat: <?php echo $location['lat'] ?></div>
											<div class="lng">lng: <?php echo $location['lng'] ?></div>
										</div>
									</div>

									<div class="actions">
										<div class="edit">
											<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</div>
										<div class="delete">
											<svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>
										</div>
									</div>
								</div>

								<?php
							}
						}
					?>
				</div>
			</div>
		</div>
	</main><!-- #main -->

<?php
get_footer();
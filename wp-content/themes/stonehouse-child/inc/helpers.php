<?php

if ( ! function_exists( 'wpr_async_js' ) ) {
	/**
	 * If the script tag contains the word "async" then return the tag as is, otherwise add the word
	 * "async" to the tag
	 *
	 * @param string tag The script tag.
	 *
	 * @return string str_replace() function is being used to replace the first occurrence of the string
	 * '<script' with the string '<script async'.
	 */
	function wpr_async_js( string $tag ) {
		return str_replace( '<script', '<script async', $tag );
	}
}
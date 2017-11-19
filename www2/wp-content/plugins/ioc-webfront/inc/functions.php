<?php 

/**
 * remove wp logo, updates, comments from admin bar in the top
 */
add_action( 'wp_before_admin_bar_render', 'remove_admin_bar_links' );
function remove_admin_bar_links() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('wp-logo');          // Remove the WordPress logo
    // $wp_admin_bar->remove_menu('about');            // Remove the about WordPress link
    // $wp_admin_bar->remove_menu('wporg');            // Remove the WordPress.org link
    // $wp_admin_bar->remove_menu('documentation');    // Remove the WordPress documentation link
    // $wp_admin_bar->remove_menu('support-forums');   // Remove the support forums link
    // $wp_admin_bar->remove_menu('feedback');         // Remove the feedback link
    // $wp_admin_bar->remove_menu('site-name');        // Remove the site name menu
    // $wp_admin_bar->remove_menu('view-site');        // Remove the view site link
    $wp_admin_bar->remove_menu('updates');          // Remove the updates link
    $wp_admin_bar->remove_menu('comments');         // Remove the comments link
    // $
}
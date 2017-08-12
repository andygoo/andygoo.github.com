<!DOCTYPE html>
<html dir="ltr" lang="en-US">

<head>
	<title>HTML5/CSS3社会化分享按钮DEMO演示</title>
	
	<!-- Meta -->
	<meta charset="UTF-8">
	<meta name="author" content="@toddmotto">
	
	<!-- CSS -->
	<link rel="stylesheet" href="assets/css/global.css">
	<link rel="stylesheet" href="assets/css/social-media.css">
	
	<!-- Load jQuery from Google CDN -->
	<script src="jquery.js"></script>

</head>

<body>
	<div style="text-align:center;clear:both;">
<script src="/gg_bd_ad_720x90.js" type="text/javascript"></script>
<script src="/follow.js" type="text/javascript"></script>
</div>
	<section id="wrapper">
		<article id="main">
		
			<h3 style="clear:both;float:left;border-bottom:1px solid #E5E5E5;margin:15px 0 -10px 0;">Full Length Coded Icons (Editable text)</h3>
			<?php
				// Fill out the PHP Strings below to create your buttons
				$iconfull = array(
					array( // RSS
						'rss', // Class for the Button (colour)
						'#', // URL of Button
						'rss.png', // Image name
						'Subscribe'), // Word inside Button
						
					array( // Twitter
						'twitter', // Class for the Button (colour)
						'#', // URL of Button
						'twitter.png', // Image name
						'Twitter'), // Word inside Button
						
					array(
						'facebook', // Class for the Button (colour)
						'#', // URL of Button
						'facebook.png', // Image name
						'Facebook'), // Word inside Button
					array(
						'linkedin', // Class for the Button (colour)
						'#', // URL of Button
						'linkedin.png', // Image name
						'LinkedIn'), // Word inside Button
					array(
						'googleplus', // Class for the Button (colour)
						'#', // URL of Button
						'googleplus.png', // Image name
						'Google+'), // Word inside Button
					array(
						'pinterest', // Class for the Button (colour)
						'#', // URL of Button
						'pinterest.png', // Image name
						'Pinterest'), // Word inside Button
					array(
						'dribbble', // Class for the Button (colour)
						'#', // URL of Button
						'dribbble.png', // Image name
						'Dribbble'), // Word inside Button
					array(
						'forrst', // Class for the Button (colour)
						'#', // URL of Button
						'forrst.png', // Image name
						'Forrst'), // Word inside Button
	
				); ?>
				
				<ul id="coded-social-full">
					<?php
		
					// Spit it out!
					
					foreach($iconfull as $info) {echo'<li class="'.$info[0].'"><a href="'.$info[1].'"><img src="assets/img/'.$info[2].'">'.$info[3].'</a></li>
					';}
					?></ul>

				<h3 style="clear:both;float:left;border-bottom:1px solid #E5E5E5;margin:15px 0 -10px 0;">Square Coded Icons</h3>
				<?php
				// Fill out the PHP Strings below to create your buttons
				$iconsquare = array(
					array( // RSS
						'rss', // Class for the Button (colour)
						'#', // URL of Button
						'rss.png'), // Image name
					array( // Twitter
						'twitter', // Class for the Button (colour)
						'#', // URL of Button
						'twitter.png'), // Image name
					array(
						'facebook', // Class for the Button (colour)
						'#', // URL of Button
						'facebook.png'), // Image name
					array(
						'linkedin', // Class for the Button (colour)
						'#', // URL of Button
						'linkedin.png'), // Image name
					array(
						'googleplus', // Class for the Button (colour)
						'#', // URL of Button
						'googleplus.png'), // Image name
					array(
						'pinterest', // Class for the Button (colour)
						'#', // URL of Button
						'pinterest.png'), // Image name
					array(
						'dribbble', // Class for the Button (colour)
						'#', // URL of Button
						'dribbble.png'), // Image name
					array(
						'forrst', // Class for the Button (colour)
						'#', // URL of Button
						'forrst.png'), // Image name
				); ?>
				
				<ul id="coded-social-square">
					<?php
		
					// Spit it out!
					
					foreach($iconsquare as $info) {echo'<li class="'.$info[0].'"><a href="'.$info[1].'"><img src="assets/img/'.$info[2].'"></a></li>
					';}
					?></ul>

					
				<h3 style="clear:both;float:left;border-bottom:1px solid #E5E5E5;margin:15px 0 -10px 0;">Circle Coded Icons</h3>
				<?php
				// Fill out the PHP Strings below to create your buttons
				$iconcircle = array(
					array( // RSS
						'rss', // Class for the Button (colour)
						'#', // URL of Button
						'rss.png'), // Image name
					array( // Twitter
						'twitter', // Class for the Button (colour)
						'#', // URL of Button
						'twitter.png'), // Image name
					array(
						'facebook', // Class for the Button (colour)
						'#', // URL of Button
						'facebook.png'), // Image name
					array(
						'linkedin', // Class for the Button (colour)
						'#', // URL of Button
						'linkedin.png'), // Image name
					array(
						'googleplus', // Class for the Button (colour)
						'#', // URL of Button
						'googleplus.png'), // Image name
					array(
						'pinterest', // Class for the Button (colour)
						'#', // URL of Button
						'pinterest.png'), // Image name
					array(
						'dribbble', // Class for the Button (colour)
						'#', // URL of Button
						'dribbble.png'), // Image name
					array(
						'forrst', // Class for the Button (colour)
						'#', // URL of Button
						'forrst.png'), // Image name
				); ?>
				
				<ul id="coded-social-circle">
					<?php
		
					// Spit it out!
					
					foreach($iconcircle as $info) {echo'<li class="'.$info[0].'"><a href="'.$info[1].'"><img src="assets/img/'.$info[2].'"></a></li>
					';}
					?></ul>

				<h3 style="clear:both;float:left;border-bottom:1px solid #E5E5E5;margin:15px 0 -10px 0;">Circle (with thin border) Coded Icons</h3>
				<?php
				// Fill out the PHP Strings below to create your buttons
				$iconcircleborder = array(
					array( // RSS
						'rss', // Class for the Button (colour)
						'#', // URL of Button
						'rss.png'), // Image name
					array( // Twitter
						'twitter', // Class for the Button (colour)
						'#', // URL of Button
						'twitter.png'), // Image name
					array(
						'facebook', // Class for the Button (colour)
						'#', // URL of Button
						'facebook.png'), // Image name
					array(
						'linkedin', // Class for the Button (colour)
						'#', // URL of Button
						'linkedin.png'), // Image name
					array(
						'googleplus', // Class for the Button (colour)
						'#', // URL of Button
						'googleplus.png'), // Image name
					array(
						'pinterest', // Class for the Button (colour)
						'#', // URL of Button
						'pinterest.png'), // Image name
					array(
						'dribbble', // Class for the Button (colour)
						'#', // URL of Button
						'dribbble.png'), // Image name
					array(
						'forrst', // Class for the Button (colour)
						'#', // URL of Button
						'forrst.png'), // Image name
				); ?>
				
				<ul id="coded-social-circle-border">
					<?php
		
					// Spit it out!
					
					foreach($iconcircleborder as $info) {echo'<li class="'.$info[0].'"><a href="'.$info[1].'"><img src="assets/img/'.$info[2].'"></a></li>
					';}
					?></ul>
					
		</article>
	</section>
	
</body>
</html>
/*
	Read Only by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$titleBar = null,
		$nav = $('#nav'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '1025px',  '1280px' ],
			medium:   [ '737px',   '1024px' ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Header Panel.

		// Nav.
			var $nav_a = $nav.find('a');

			$nav_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$nav_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '5vh',
							bottom: '5vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($nav_a.filter('.active-locked').length == 0) {

										$nav_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		// Title Bar.
			$titleBar = $(
				'<div id="titleBar">' +
					'<a href="#header" class="toggle"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$header
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'header-visible'
				});

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				if (breakpoints.active('<=medium'))
					return $titleBar.height();

				return 0;

			}
		});

	/**
	 * Skill Bars Animation
	 * 
	 * This code implements a scroll-based animation for the skill bars in the "Le Mie Competenze" section.
	 * When the section enters the viewport, the skill bars gradually fill up to their original width.
	 * When the section leaves the viewport, the skill bars reset to zero width.
	 * 
	 * The animation uses CSS transitions for smooth effects and the scrollex plugin to detect
	 * when the section enters and leaves the viewport.
	 */

	// Store original skill bar widths on page load
	$(window).on('load', function() {
		// Initialize skill bars
		initSkillBars();

		// Check if skills section is already in viewport on page load
		// and trigger animation if needed
		setTimeout(function() {
			var $skillsSection = $('#two');
			var windowHeight = $(window).height();
			var scrollTop = $(window).scrollTop();
			var sectionTop = $skillsSection.offset().top;
			var sectionHeight = $skillsSection.height();

			// If skills section is in viewport on page load, animate the bars
			if (
				(sectionTop < (scrollTop + windowHeight)) && 
				((sectionTop + sectionHeight) > scrollTop)
			) {
				console.log('Skills section in viewport on page load, triggering animation');
				animateSkillBars();
			}
		}, 500);
	});

	// Function to initialize skill bars
	function initSkillBars() {
		$('#two .skill-bar').each(function() {
			var $this = $(this);

			// Get the original width from the inline style attribute
			// This handles both percentage and pixel values
			var originalWidth = $this.attr('style') ? 
				($this.attr('style').indexOf('width:') > -1 ? 
					$this.attr('style').split('width:')[1].split(';')[0].trim() : 
					$this.css('width')) : 
				$this.css('width');

			// Store the original width in a data attribute for later use
			// and set initial width to 0 to prepare for animation
			$this.data('original-width', originalWidth);
			$this.css('width', '0');

			// Log for debugging
			console.log('Skill bar original width:', originalWidth);
		});
	}

	// Function to animate skill bars
	function animateSkillBars() {
		$('#two .skill-bar').each(function() {
			var $this = $(this);
			var originalWidth = $this.data('original-width');

			console.log('Animating skill bar to width:', originalWidth);

			// Clear any existing timeouts to prevent conflicts
			if ($this.data('animation-timeout')) {
				clearTimeout($this.data('animation-timeout'));
			}

			// Add a delay that increases for each skill bar to create a cascading effect
			var index = $this.parent().parent().index();
			var delay = 200 + (index * 150); // 200ms base delay + 150ms per item

			var timeout = setTimeout(function() {
				// Force browser to recalculate layout before animation
				$this.css('width', '0');

				// Trigger reflow to ensure animation works
				$this[0].offsetHeight;

				// Apply the original width to trigger the animation
				$this.css('width', originalWidth);
			}, delay);

			// Store the timeout ID for potential clearing
			$this.data('animation-timeout', timeout);
		});
	}

	// Configure scrollex for the skills section
	$('#two').scrollex({
		// Trigger when any part of the section is in view
		mode: 'default',
		// Define a larger trigger zone (5% from top and bottom of viewport)
		top: '5%',
		bottom: '5%',

		// When the section enters the viewport
		enter: function() {
			console.log('Skills section entered viewport');

			// Use the centralized animation function
			animateSkillBars();
		},

		// When the section leaves the viewport
		leave: function() {
			console.log('Skills section left viewport');

			// Reset all skill bars to zero width
			$('#two .skill-bar').css('width', '0');
		}
	});

})(jQuery);

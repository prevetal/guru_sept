WW = window.innerWidth || document.clientWidth || document.getElementsByTagName('body')[0].clientWidth
WH = window.innerHeight || document.clientHeight || document.getElementsByTagName('body')[0].clientHeight
BODY = document.getElementsByTagName('body')[0]


document.addEventListener('DOMContentLoaded', function() {
	// Review images slider
	const reviewImagesSliders = [],
		reviewImages = document.querySelectorAll('.review .images.swiper')

	reviewImages.forEach((el, i) => {
		el.classList.add('review_images_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			lazy: true,
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			spaceBetween: 0,
			slidesPerView: 1
		}

		reviewImagesSliders.push(new Swiper('.review_images_s' + i, options))
	})


	// Tabs
	var locationHash = window.location.hash

	$('body').on('click', '.tabs .btn', function(e) {
		e.preventDefault()

		if (!$(this).hasClass('active')) {
			let parent = $(this).closest('.tabs_container'),
				activeTab = $(this).data('content'),
				activeTabContent = $(activeTab),
				level = $(this).data('level')

			parent.find('.tabs:first .btn').removeClass('active')
			parent.find('.tab_content.' + level).removeClass('active')

			$(this).addClass('active')
			activeTabContent.addClass('active')
		}
	})

	if (locationHash && $('.tabs_container').length) {
		let activeTab = $(`.tabs button[data-content="${locationHash}"]`),
			activeTabContent = $(locationHash),
			parent = activeTab.closest('.tabs_container'),
			level = activeTab.data('level')

		parent.find('.tabs:first .btn').removeClass('active')
		parent.find('.tab_content.' + level).removeClass('active')

		activeTab.addClass('active')
		activeTabContent.addClass('active')

		$('html, body').stop().animate({ scrollTop: $activeTabContent.offset().top }, 1000)
	}


	// Fancybox
	const fancyOptions = {
		dragToClose: false,
		placeFocusBack: false,
		l10n: {
			CLOSE: 'Закрыть',
			NEXT: 'Следующий',
			PREV: 'Предыдущий',
			MODAL: 'Вы можете закрыть это модальное окно нажав клавишу ESC'
		},
		on: {
			ready: (fancybox) => {
				const container = fancybox.getContainer()

				const btn = container.querySelector('.is-close-button')

				if (btn) {
					btn.classList.add('is-close-btn')
					btn.innerHTML = '<svg><use xlink:href="images/sprite.svg#ic_close"></use></svg>'
				}
			},
		}
	}


	// Modals
	$('.modal_btn').click(function(e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show(
			[{
				src: `#${e.target.getAttribute('data-modal')}`,
				type: 'inline'
			}],
			fancyOptions
		)
	})


	// Zoom images
	Fancybox.bind('.fancy_img', {
		...fancyOptions,
		Image: {
			zoom: false
		},
		Thumbs: {
			autoStart: false
		}
	})


	$('.audio_btn').click(function(e) {
		e.preventDefault()

		const audioSrc = $(this).data('audio')

		$('#audio source').attr('src', audioSrc)
		$('#audio')[0].load()

		Fancybox.close()

		Fancybox.show([
			{
				src: '#audio_modal',
				type: 'inline'
			}
		], {
			...fancyOptions,
			on: {
				...fancyOptions.on,

				destroy: () => {
					const audio = document.getElementById('audio')

					if (audio) {
						audio.pause()
						audio.currentTime = 0
					}
				}
			}
		})
	})


	// Phone input mask
	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true
			})
		})
	}


	// Accordion
	$('body').on('click', '.accordion .accordion_item .head', function(e) {
		e.preventDefault()

		let item = $(this).closest('.accordion_item'),
			accordion = $(this).closest('.accordion')

		if (accordion.hasClass('single')) {
			if (!item.hasClass('active')) {
				accordion.find('.accordion_item').removeClass('active')
				accordion.find('.data').slideUp(300)

				item.addClass('active').find('.data').slideDown(300)

				if (accordion.closest('.what_if').length) {
					$('.what_if .images .image').hide()
					$('.what_if .images .image').eq(item.index()).fadeIn(300)
				}
			}
		} else {
			item.toggleClass('active').find('.data').slideToggle(300)
		}
	})


	// Cookies
	const cookies = localStorage.getItem('cookies')

	if (cookies !== 'false') {
		$('.cookies').addClass('show')
	}

	$('.cookies .btn').click(function (e) {
		e.preventDefault()

		$('.cookies').removeClass('show')

		localStorage.setItem('cookies', 'false')
	})


	// Before/After
	$('.before_after .images').each(function() {
		const container = $(this)
		const slider = container.find('.slider')

		let isDragging = false

		function getPercent(clientX) {
			const rect = container[0].getBoundingClientRect()

			let percent = (clientX - rect.left) / rect.width * 100

			return Math.min(100, Math.max(0, percent))
		}

		function updatePosition(percent) {
			const parent = container.closest('.before_after')

			slider.val(percent)

			parent.find('.img.before img').css('clip-path', `inset(0 ${100 - percent}% 0 0)`)
			parent.find('.circle').css('left', `${percent}%`)
			parent.find('.line').css('left', `${percent}%`)
		}

		slider.on('input change', function() {
			updatePosition($(this).val())
		})

		container[0].addEventListener('touchstart', function(e) {
			isDragging = true

			const touch = e.touches[0]

			updatePosition(getPercent(touch.clientX))
		}, { passive: true })

		container[0].addEventListener('touchmove', function(e) {
			if (!isDragging) return

			e.preventDefault()

			const touch = e.touches[0]

			updatePosition(getPercent(touch.clientX))
		}, { passive: false })

		container[0].addEventListener('touchend', function() {
			isDragging = false;
		}, { passive: true })
	})


	// Calc
	$('.calc .price_input').on('input', function () {
		calc($(this).closest('.calc'))
	})

	$('.calc .in_spring_input').on('change', function () {
		calc($(this).closest('.calc'))
	})

	$('.calc .how_often').on('change', function () {
		calc($(this).closest('.calc'))
	})

	$('.calc').each(function () {
		calc($(this))
	})


	// Chart
	const ctx = document.getElementById('chart')

	new Chart(ctx, {
		type: 'line',
		data: {
			labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			datasets: [
				{
					label: 'Септик из бетонных колец',
					data: [30000, 70000, 120000, 180000, 250000, 320000, 400000, 480000, 560000, 650000],
					borderWidth: 2,
					borderColor: '#F87000',
					backgroundColor: '#F87000'
				},
				{
					label: 'Станция биологической очистки',
					data: [20000, 40000, 60000, 85000, 110000, 140000, 170000, 205000, 240000, 280000],
					borderWidth: 2,
					borderColor: '#045CFB',
					backgroundColor: '#045CFB'
				}
			]
		},
		options: {
			scales: {
				x: {
					title: {
						display: true,
						text: 'Годы эксплуатации',
						align: 'start',
					}
				},
				y: {
					title: {
						display: true,
						text: 'Накопленные расходы, тыс. ₽',
						align: 'start',
					}
				}
			},

			responsive: true,
			maintainAspectRatio: false,

			interaction: {
				mode: 'index',
				intersect: false
			},

			plugins: {
				tooltip: {
					mode: 'index',
					intersect: false
				}
			}
		}
	})
})



function calc(context) {
	const price = parseInt(context.find('.price_input').val().replace(/\D/g, ''), 10),
		inSpring = context.find('.in_spring_input:checked').val(),
		howOften = context.find('.how_often:checked').val()

	var normalWeeks = 48,
		increasedWeeks = 0

	if (inSpring === 'flooding') {
		normalWeeks = 36,
		increasedWeeks = 12
	}

	const result = Math.round(
		(Number(price) * normalWeeks) +
		(Number(price) * 1.5 * increasedWeeks)
	)

	context.find('.result .prices .one_year').text(result.toLocaleString('ru-RU'))
	context.find('.result .prices .two_years').text((result * 2).toLocaleString('ru-RU'))
	context.find('.result .desc .price').text(result.toLocaleString('ru-RU'))
}



window.addEventListener('resize', function () {
	WH = window.innerHeight || document.clientHeight || BODY.clientHeight

	let windowW = window.outerWidth

	if (typeof WW !== 'undefined' && WW != windowW) {
		// Overwrite window width
		WW = window.innerWidth || document.clientWidth || BODY.clientWidth


		// Mob. version
		if (!fakeResize) {
			fakeResize = true
			fakeResize2 = false

			document.getElementsByTagName('meta')['viewport'].content = 'width=device-width, initial-scale=1, maximum-scale=1'
		}

		if (!fakeResize2) {
			fakeResize2 = true

			if (windowW < 375) document.getElementsByTagName('meta')['viewport'].content = 'width=375, user-scalable=no'
		} else {
			fakeResize = false
			fakeResize2 = true
		}
	}
})
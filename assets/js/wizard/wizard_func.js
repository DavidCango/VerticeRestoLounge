	/*  Wizard */
	// Chose here which method to send the email by changing the path here $('form#wrapped').attr('action', 'phpmailer/reserve_template_email.php'); available mehtods:
	// Phpmaimer text/html > phpmailer/reserve.php
	// PHPmailer with html template > phpmailer/reserve_template_email.php (default)
	// PHPmailer with html template SMTP > phpmailer/reserve_template_email_smtp.php

jQuery(function ($) {
	"use strict";
	$('form#wrapped').on('submit', function (e) {
		e.preventDefault();

		let fecha = $("#datepicker_field").val();
		let fechaFormateada = formatearFecha(fecha);
		let hora = $("#horaReserva").val();
		let personas = $("#personasReserva").val();

		let mensaje =
		"Hola 👋\n\n" +
		"Quisiera reservar en Vértice Resto Lounge para:\n\n" +
		"📅 Fecha: " + fechaFormateada + "\n" +
		"🕒 Hora: " + hora + "\n" +
		"👥 Invitados: " + personas + " persona(s)\n\n" +
		"¿Me pueden confirmar la disponibilidad?\n\n" +
		"¡Muchas gracias! 😊";

		window.open(
			"https://api.whatsapp.com/send?phone=593979238423&text=" + encodeURIComponent(mensaje),
			"_blank"
		);

		setTimeout(function() {
			location.reload();
		}, 1000);
	});

	function formatearFecha(fecha) {
		const [dia, mes, anio] = fecha.split('/');

		const fechaObj = new Date(anio, mes - 1, dia);

		const dias = [
			'Domingo', 'Lunes', 'Martes', 'Miércoles',
			'Jueves', 'Viernes', 'Sábado'
		];

		const meses = [
			'Enero', 'Febrero', 'Marzo', 'Abril',
			'Mayo', 'Junio', 'Julio', 'Agosto',
			'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
		];

		return `${dias[fechaObj.getDay()]} ${parseInt(dia)} de ${meses[mes - 1]} de ${anio}`;
	}

	$("#wizard_container").wizard({
		stepsWrapper: "#wrapped",
		submit: ".submit",
		beforeSelect: function (event, state) {
			if ($('input#website').val().length != 0) {
				return false;
			}
			if (!state.isMovingForward)
				return true;
			var inputs = $(this).wizard('state').step.find(':input');
			return !inputs.length || !!inputs.valid();
		}
	}).validate({
		errorPlacement: function (error, element) {
			if (element.is(':radio') || element.is(':checkbox')) {
				error.insertBefore(element.next());
			} else {
				error.insertAfter(element);
			}
		}
	});

	//  progress bar
	$("#progressbar").progressbar();

	$("#wizard_container").wizard({
		afterSelect: function (event, state) {
			$("#progressbar").progressbar("value", state.percentComplete);
			$("#location").text("(" + state.stepsComplete + "/" + state.stepsPossible + ")");
		}
	});

	// Validate select
	$('#wrapped').validate({
		ignore: [],
		rules: {
			datepicker_field: {
				required: true
			},
			horaReserva: {
				required: true
			},
			personasReserva: {
				required: true
			}
		},
		messages: {
			datepicker_field: {
				required: "Por favor selecciona una fecha."
			},
			horaReserva: {
				required: "Por favor selecciona una hora."
			},
			personasReserva: {
				required: "Por favor selecciona el número de personas."
			}
		},
		errorPlacement: function (error, element) {
			if (element.is('select:hidden')) {
				error.insertAfter(element.next('.nice-select'));
			} else {
				error.insertAfter(element);
			}
		}
	});

	// Submit loader mask 
	// $('form#wrapped').on('submit', function () {
	// 	var form = $("form#wrapped");
	// 	form.validate();
	// 	if (form.valid()) {
	// 		$("#loader_form").fadeIn();
	// 	}
	// });

	$('#DatePicker').datepicker({
		closeText: 'Cerrar',
		prevText: 'Anterior',
		nextText: 'Siguiente',
		currentText: 'Hoy',
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
					'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
						'Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		firstDay: 1,
		showButtonPanel: false,
		inline: true,
		dateFormat:"dd/mm/yy",
		onSelect: function(dateText, inst) { 
			$("#datepicker_field").val(dateText); 
			$("#datepicker_field").valid();
		},
		// 0 = lunes, 1 = martes, ..., 6 = domingo 
		// beforeShowDay: function(date) {
		// 	var day = date.getDay();
		// 	return [(day != 0), ''];
		// },
		// end disabled
		minDate: 0
	});

	$(".ui-datepicker-today .ui-state-default").removeClass("ui-state-highlight ui-state-active ui-state-hover")  // fix current date
});
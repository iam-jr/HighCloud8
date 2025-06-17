(function () {
  const submitBtn = document.getElementById('submitBtn');
  const paypalSuscripcion = document.getElementById('paypal-suscripcion');

  let pagoCompletado = false;

  // Botón de suscripción
  paypal.Buttons({
    style: {
      shape: 'rect',
      color: 'gold',
      layout: 'vertical',
      label: 'subscribe',
    },
    createSubscription: function (data, actions) {
      return actions.subscription.create({
        plan_id: 'P-7GG71663VP171750UNBGVNNQ'
      });
    },
    onApprove: function (data, actions) {
      alert('¡Suscripción activada! ID: ' + data.subscriptionID);
      pagoCompletado = true;
      habilitarEnvio();
    }
  }).render('#paypal-suscripcion');

  // Detectar si se pagó el Plan Básico manual
  const planBasicoForm = document.querySelector('form[action*="paypal.com/ncp/payment/497F5HYDKV3XQ"]');
  planBasicoForm.addEventListener('submit', () => {
    // Como es un formulario externo, solo asumimos que fue enviado
    pagoCompletado = true;
    setTimeout(habilitarEnvio, 1000); // Pequeño delay por si redirige
  });

  // Función para activar botón de envío
  function habilitarEnvio() {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-disabled');
    submitBtn.classList.add('enabled');
  }

  // Enviar
  submitBtn.addEventListener('click', function () {
    if (pagoCompletado) {
      alert('Formulario enviado. ¡Gracias por tu pago!');
      window.location.href = 'gracias.html';
    } else {
      alert('Debes completar uno de los pagos antes de continuar.');
    }
  });
})();

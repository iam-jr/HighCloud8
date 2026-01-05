(function () {
  const submitBtn = document.getElementById('submitBtn');
  const cardSubmit = document.getElementById('card-submit');
  const cardStatus = document.getElementById('card-status');
  const planRadios = document.querySelectorAll('input[name="cardPlan"]');
  const amountBasico = document.getElementById('amount-basico');
  const amountSuscripcion = document.getElementById('amount-suscripcion');
  const amountGroupBasico = document.querySelector('[data-plan="basico"]');
  const amountGroupSuscripcion = document.querySelector('[data-plan="suscripcion"]');
  const planBasicoForm = document.querySelector('form[action*="paypal.com/ncp/payment/497F5HYDKV3XQ"]');
  const paypalSuscripcionDiv = document.getElementById('paypal-suscripcion');
  const cardFieldsWrapper = document.getElementById('card-fields');
  const cardActionsWrapper = document.querySelector('.card-actions');
  const paypalFallbackBox = document.getElementById('paypal-card-fallback');
  const paypalFallbackButtons = document.getElementById('paypal-card-buttons');
  const BASICO_AMOUNT = '289';
  const SUSCRIPCION_AMOUNT = '50';

  let pagoCompletado = false;
  let hostedFieldsInstance = null;

  function setStatus(msg, type = 'info') {
    if (!cardStatus) return;
    cardStatus.textContent = msg;
    cardStatus.style.color = type === 'error' ? '#d63031' : type === 'success' ? '#00b894' : '#425063';
  }

  function toggleAmounts() {
    const plan = document.querySelector('input[name="cardPlan"]:checked')?.value || 'basico';
    if (plan === 'basico') {
      amountGroupBasico.style.display = 'flex';
      amountGroupSuscripcion.style.display = 'none';
    } else {
      amountGroupBasico.style.display = 'none';
      amountGroupSuscripcion.style.display = 'flex';
    }
  }

  function getAmount(plan) {
    return plan === 'basico' ? BASICO_AMOUNT : SUSCRIPCION_AMOUNT;
  }

  planRadios.forEach(r => r.addEventListener('change', toggleAmounts));
  toggleAmounts();

  function habilitarEnvio() {
    if (!submitBtn) return;
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-disabled');
    submitBtn.classList.add('enabled');
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      if (pagoCompletado) {
        alert('Formulario enviado. ¡Gracias por tu pago!');
        window.location.href = 'gracias.html';
      } else {
        alert('Debes completar uno de los pagos antes de continuar.');
      }
    });
  }

  // Fallback: si envían el form básico PayPal externo
  if (planBasicoForm) {
    planBasicoForm.addEventListener('submit', () => {
      pagoCompletado = true;
      setTimeout(habilitarEnvio, 1000);
    });
  }

  // Render hosted fields (tarjeta en la página)
  if (window.paypal && paypal.HostedFields && paypal.HostedFields.isEligible()) {
    setStatus('Cargando campos de tarjeta...');
    paypal.HostedFields.render({
      createOrder: () => {
        const plan = document.querySelector('input[name="cardPlan"]:checked')?.value || 'basico';
        const amount = getAmount(plan);
        const description = plan === 'basico'
          ? `Plan Básico - Pago único $${amount}`
          : `Suscripción - Primer mes $${amount}`;

        return fetch('paypal-create-order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, description })
        })
        .then(res => res.json())
        .then(data => data.id)
        .catch(() => {
          setStatus('No se pudo crear la orden. Intenta de nuevo.', 'error');
        });
      },
      styles: {
        'input': {
          'font-size': '16px',
          'color': '#1f2d3d'
        },
        ':focus': {
          'color': '#111'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111'
        },
        expirationDate: {
          selector: '#card-expiry',
          placeholder: 'MM/AA'
        },
        cvv: {
          selector: '#card-cvv',
          placeholder: '123'
        }
      }
    }).then(instance => {
      hostedFieldsInstance = instance;
      setStatus('Listo para pagar con tarjeta.', 'info');
      if (cardSubmit) {
        cardSubmit.disabled = false;
        cardSubmit.addEventListener('click', handleCardPay);
      }
    }).catch(() => {
      setStatus('No se pudieron cargar los campos de tarjeta. Intenta recargar.', 'error');
    });
  } else {
    setStatus('No pudimos mostrar la tarjeta aquí. Usa PayPal en este bloque.', 'error');
    if (cardFieldsWrapper) cardFieldsWrapper.style.display = 'none';
    if (cardActionsWrapper) cardActionsWrapper.style.display = 'none';
    if (paypalFallbackBox && paypalFallbackButtons && paypal && paypal.Buttons) {
      paypalFallbackBox.style.display = 'block';
      const renderFallback = () => {
        const plan = document.querySelector('input[name="cardPlan"]:checked')?.value || 'basico';
        const amount = getAmount(plan);
        const description = plan === 'basico'
          ? `Plan Básico - Pago único $${amount}`
          : `Suscripción - Primer mes $${amount}`;

        paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'pay',
          },
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [{
                description,
                amount: {
                  currency_code: 'USD',
                  value: amount
                }
              }]
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function () {
              pagoCompletado = true;
              setStatus('Pago completado con PayPal. Puedes continuar.', 'success');
              habilitarEnvio();
            });
          },
          onError: function () {
            setStatus('No pudimos procesar el pago por PayPal aquí. Intenta de nuevo.', 'error');
          }
        }).render('#paypal-card-buttons');
      };

      // Re-render fallback when changing plan amount
      planRadios.forEach(r => r.addEventListener('change', () => {
        if (paypalFallbackButtons) paypalFallbackButtons.innerHTML = '';
        renderFallback();
      }));
      [amountBasico, amountSuscripcion].forEach(sel => sel && sel.addEventListener('change', () => {
        if (paypalFallbackButtons) paypalFallbackButtons.innerHTML = '';
        renderFallback();
      }));

      renderFallback();
    }
  }

  function handleCardPay(e) {
    e.preventDefault();
    if (!hostedFieldsInstance) return;
    const plan = document.querySelector('input[name="cardPlan"]:checked')?.value || 'basico';
    const amount = getAmount(plan);

    cardSubmit.disabled = true;
    setStatus('Procesando pago...', 'info');

    hostedFieldsInstance.submit({ contingencies: ['3D_SECURE'] })
      .then(payload => {
        return fetch('paypal-capture-order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: payload.orderId })
        }).then(res => res.json());
      })
      .then(data => {
        if (data && data.status === 'COMPLETED') {
          pagoCompletado = true;
          setStatus('Pago completado. Puedes continuar.', 'success');
          habilitarEnvio();
        } else {
          setStatus('No pudimos confirmar el pago. Intenta de nuevo.', 'error');
        }
      })
      .catch(() => {
        setStatus('Error al procesar el pago. Verifica la tarjeta o intenta de nuevo.', 'error');
      })
      .finally(() => {
        cardSubmit.disabled = false;
      });
  }

  // Suscripción PayPal (botón) se mantiene como alternativa
  if (paypal && paypal.Buttons && paypalSuscripcionDiv) {
    paypal.Buttons({
      style: {
        shape: 'rect',
        color: 'gold',
        layout: 'vertical',
        label: 'subscribe',
      },
      createSubscription: function (data, actions) {
        return actions.subscription.create({ plan_id: 'P-7GG71663VP171750UNBGVNNQ' });
      },
      onApprove: function (data) {
        alert('¡Suscripción activada! ID: ' + data.subscriptionID);
        pagoCompletado = true;
        habilitarEnvio();
      }
    }).render('#paypal-suscripcion');
  }
})();

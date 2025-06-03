function showModal(title, description) {
        document.getElementById('serviceModalLabel').textContent = title;
        document.getElementById('serviceDescription').textContent = description;
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
    }
    function showModal(title, description) {
        document.getElementById('serviceModalLabel').textContent = title;
        document.getElementById('serviceDescription').textContent = description;
        const modal = new bootstrap.Modal(document.getElementById('serviceModal'));
        modal.show();
    }

    document.addEventListener("DOMContentLoaded", function () {
        const dominioSelect = document.querySelector("select[name='dominio']");
        const campoDominio = document.getElementById("campo_dominio");
      
        if (dominioSelect) {
          dominioSelect.addEventListener("change", function () {
            campoDominio.style.display = this.value === "si" ? "block" : "none";
          });
        }
      
        // Puedes añadir más lógica aquí según necesidades
        const form = document.getElementById("clienteForm");
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          alert("Formulario enviado correctamente.");
          window.location.href = "gracias.html";
        });
      });
      

    // Initialize Google Map (replace with actual API key)
    function initMap() {
        var map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 40.748817, lng: -73.985428 },
            zoom: 13,
        });
        var marker = new google.maps.Marker({
            position: { lat: 40.748817, lng: -73.985428 },
            map: map,
            title: "Our Office",
        });
    }

    function toggleLogoUpload() {
        const select = document.getElementById("tiene_logo");
        const upload = document.getElementById("logoUpload");
        upload.style.display = select.value === "si" ? "block" : "none";
      }
  
      function toggleContentUpload() {
        const select = document.getElementById("contenido_estado");
        const upload = document.getElementById("archivosUpload");
        upload.style.display = select.value === "si" || select.value === "parcial" ? "block" : "none";
      }
  
      window.onload = function() {
        toggleLogoUpload();
        toggleContentUpload();
      }

      function toggleLogoUpload() {
        const select = document.getElementById("tiene_logo");
        const upload = document.getElementById("logoUpload");
        upload.style.display = select.value === "si" ? "block" : "none";
      }
  
      function toggleContentUpload() {
        const select = document.getElementById("contenido_estado");
        const upload = document.getElementById("archivosUpload");
        upload.style.display = select.value !== "no" ? "block" : "none";
      }
  
      function toggleBlogOptions(checkbox) {
        const blogOptions = document.getElementById("blogOptions");
        blogOptions.style.display = checkbox.checked ? "block" : "none";
      }
  
      function previewLogo(event) {
        const file = event.target.files[0];
        const preview = document.getElementById("logoPreview");
        preview.innerHTML = "";
      
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const img = document.createElement("img");
            img.src = e.target.result;
      
            const removeBtn = document.createElement("button");
            removeBtn.innerHTML = "&times;";
            removeBtn.className = "file-remove";
            removeBtn.onclick = function () {
              document.getElementById("logoInput").value = "";
              preview.innerHTML = "";
            };
      
            const container = document.createElement("div");
            container.className = "file-preview-item";
            container.appendChild(img);
            container.appendChild(removeBtn);
            preview.appendChild(container);
          };
          reader.readAsDataURL(file);
        }
        
      }
      function toggleLogoUpload() {
        const select = document.getElementById("tiene_logo");
        const upload = document.getElementById("logoUpload");
        if (select.value === "si") {
          upload.style.display = "block";
        } else {
          upload.style.display = "none";
        }
      }
      window.onload = toggleLogoUpload;
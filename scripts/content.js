let intervalo;
let anuncios;

function init(){
    let velocidadUsuario = 1;
    let video = document.querySelector(".video-stream.html5-main-video");

    console.log("Iniciando extensión Youtube ads speedup");
    clearInterval(intervalo);

    function saltarAnuncio(nodo=document){
        setTimeout(() => {
            console.log("Saltando anuncio");
            nodo.querySelector(".ytp-ad-player-overlay-layout__skip-or-preview-container .ytp-skip-ad-button")?.click();
        }, 1000);
    }

    function regresarVelocidad(){
        console.log("Anuncio terminado, regresando velocidad");
        video.playbackRate = velocidadUsuario;
    }

    // Si al iniciar ya hay un anuncio, se acelera
    if(anuncios.querySelector(":is(.ytp-ad-action-interstitial, .ytp-ad-player-overlay-layout)")){
        saltarAnuncio();
    }

    let observer = new MutationObserver((entries) => {
        console.log("Acción de anuncio", entries);
        
        // Guardamos la velocidad con la que el usuario está viendo el video
        velocidadUsuario = video.playbackRate;

        // Este elemento se comparte entre el video normal y el anuncio, por lo tanto, afecta a los dos
        console.log("Acelerando anuncio");
        video.playbackRate = 16;

        // .ytp-ad-action-interstitial -> Ventana que aparece después de terminar un anuncio
        // .ytp-ad-player-overlay-layout -> Esta ventana contiene la información del anuncio y el boton para hacer el skip

        entries.forEach(entry => {
            entry.addedNodes.forEach(addedNode => {
                if(addedNode.matches(":is(.ytp-ad-action-interstitial, .ytp-ad-player-overlay-layout)")){
                    // Se intenta dar skip para eliminar la ventana
                    saltarAnuncio(addedNode);
                }
            })

            entry.removedNodes.forEach(removedNode => {
                if(removedNode.matches(":is(.ytp-ad-action-interstitial, .ytp-ad-player-overlay-layout)")){
                    // Al eliminarse esa ventana significa que ya terminó y regresamos el playbackRate;
                    regresarVelocidad();
                }
            })
        })
    })
    observer.observe(anuncios, {
        childList: true
    });
}

anuncios = document.querySelector(".video-ads.ytp-ad-module");

if(anuncios){
    init();
} else {
    intervalo = setInterval(() => {
        anuncios = document.querySelector(".video-ads.ytp-ad-module");
        if(anuncios){
            init();
        }
    }, 100);
}
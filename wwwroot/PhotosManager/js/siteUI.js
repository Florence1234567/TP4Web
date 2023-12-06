
let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering

Init_UI();

function Init_UI() {
    renderLogin();
    $("#createProfilCmd").on("click", function () {
        saveContentScrollPosition();
        renderRegister();
    });

    $("#abortCmd").on("click", function () {
        saveContentScrollPosition();
        eraseContent();
        updateHeader("Connexion");
        renderLogin();
    });

    $("#saveUserCmd").on("click", function () {
        saveContentScrollPosition();
        eraseContent();
        updateHeader("Liste de photo");
        renderLogin();
    });
}
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>"));
}
function eraseContent() {
    $("#content").empty();
}
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
function updateHeader(headerName, cmd) {
    $("#header").empty();
    $("#header").append(
        $(`
            <span title="Connexion" id="ConnexionCmd">
            <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">${headerName}
            </span>
            <div class="headerMenusContainer">
                <span>&nbsp;</span> <!--filler-->
            
                <div class="dropdown ms-auto dropdownLayout">
                    <!-- Articles de menu -->
                </div>
            </div>
        `))
}
function renderAbout() {
    timeout();
    saveContentScrollPosition();
    eraseContent();
    UpdateHeader("À propos...", "about");

    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de photos</h2>
                <hr>
                <p>
                    Petite application de gestion de photos multiusagers à titre de démonstration
                    d'interface utilisateur monopage réactive.
                </p>
                <p>
                    Auteur: Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2023
                </p>
            </div>
        `))
}

function renderLogin(loginMessage = "") {
    eraseContent();
    updateHeader("Connexion");
    let EmailError = "Courriel introuvable";
    let passwordError = "Mot de passe incorrect";

    let user = createNewUser();

    $("#content").append(
        $(`
            <form class="form" id="loginForm">
            <h3>${loginMessage}</h3>
                <input type='email'
                       name='Email'
                       class='form-control'
                       required
                       RequireMessage = 'Veuillez entrer votre courriel'
                       InvalidMessage = 'Courriel invalide'
                       placeholder="adresse de courriel"
                       value='${user.Email}'>
                <span style='color:red'>${EmailError}</span>
                <input type='password'
                        name='password'
                        placeholder='Mot de passe'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre mot de passe'
                        value='${user.password}'>
                <span style='color:red'>${passwordError}</span>
                <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
            </form>
            <div class="form">
                <hr>
                <button class="form-control btn-info" id="createProfilCmd">Nouveau Compte</button>
            </div>      
        `)
    )

    $("#loginForm").on("submit", async function (event) {
        event.preventDefault();
        let user = getFormData($("#loginForm"));
        showWaitingGif();
        //API saveUser
        //Check siteUI ContactsManager

        let result = await API.login(user.Email, user.password);
        if (result) {
            renderPhotos();
        }
        else {
            renderLogin("Compte introuvable");
        }
    })
}

function createNewUser() {
    let user = {};
    user.Id = 0;
    user.Email = "";
    user.Password = "";
    user.Name = "";
    user.Avatar = "";
    user.Created = 1;
    user.Authorizations = {
        readaccess: 0,
        writeaccess: 0
    }
    user.VerifyCode = "unverified";

    user.Phone = "";

    return user;
}

function renderRegister() {
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    updateHeader("Inscription"); // mettre à jour l’entête et menu
    $("#newPhotoCmd").hide(); // camouffler l’icone de commande d’ajout de photo
    $("#content").append(`
            <form class="form" id="createProfilForm"'>
                <fieldset>
                    <legend>Adresse ce courriel</legend>
                    <input type="email"
                    class="form-control Email"
                    name="Email"
                    id="Email"
                    placeholder="Courriel"
                    required
                    RequireMessage = 'Veuillez entrer votre courriel'
                    InvalidMessage = 'Courriel invalide'
                    CustomErrorMessage ="Ce courriel est déjà utilisé"/>


                    <input class="form-control MatchedInput"
                    type="text"
                    matchedInputId="Email"
                    name="matchedEmail"
                    id="matchedEmail"
                    placeholder="Vérification"
                    required
                    RequireMessage = 'Veuillez entrez de nouveau votre courriel'
                    InvalidMessage="Les courriels ne correspondent pas" />
                </fieldset>

                <fieldset>
                <legend>Mot de passe</legend>
                    <input type="password"
                    class="form-control"
                    name="Password"
                    id="Password"
                    placeholder="Mot de passe"
                    required
                    RequireMessage = 'Veuillez entrer un mot de passe'
                    InvalidMessage = 'Mot de passe trop court'/>
                
                    <input class="form-control MatchedInput"
                    type="password"
                    matchedInputId="Password"
                    name="matchedPassword"
                    id="matchedPassword"
                    placeholder="Vérification" required
                    InvalidMessage="Ne correspond pas au mot de passe" />

                </fieldset>
                <fieldset>
                <legend>Nom</legend>
                    <input type="text"
                    class="form-control Alpha"
                    name="Name"
                    id="Name"
                    placeholder="Nom"
                    required
                    RequireMessage = 'Veuillez entrer votre nom'
                    InvalidMessage = 'Nom invalide'/>
                </fieldset>

                <fieldset>
                <legend>Avatar</legend>
                    <div class='imageUploader'
                        newImage='true'
                        controlId='Avatar'
                        imageSrc='images/no-avatar.png'
                        waitingImage="images/Loading_icon.gif">
                    </div>
                </fieldset>
                <input type='submit' name='submit' id='saveUserCmd' value="Enregistrer" class="form-control btn-primary">
        </form>

        <div class="cancel">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
        </div>
    `);

    $('#loginCmd').on('click', renderLogin); // call back sur clic
    initFormValidation();
    initImageUploaders();
    $('#abortCmd').on('click', renderLogin); // call back sur clic
    // ajouter le mécanisme de vérification de doublon de courriel
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');
    // call back la soumission du formulaire
    
    $("#createProfilForm").on("submit", async function (event) {
        event.preventDefault();
        let profil = getFormData($("createProfilForm"));
        showWaitingGif(); 

        delete profil.matchedEmail;
        delete profil.matchedPassword;

        let result = await API.register(profil);

        if(result){
            renderLogin("Votre compte a été créé. Veuillez prendre vos courriels pour récupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion.");
        }
        else{
            renderLogin("La création du compte a échouée.");
        }
    });

}

function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}

function renderPhotos() {
    eraseContent();
    updateHeader("Liste des photos");

    $("#conten").append(
        $(`
        
            <h1>TEMP PHOTOS PAGE</h1>
        
        `)
    )
}

function initImageUploaders() {
    $('.imageUploader').each(function () {
        let id = $(this).attr('id');
        let controlId = $(this).attr('controlId');
        let waitingImage = $(this).attr('waitingImage');
        let newImage = $(this).attr('newImage') == '1';
        $(this).css("display","flex");
        $(this).css("flex-direction","column");
        $(this).css("align-items","center");
       // $(this).css("border","1px solid lightgray");
        $(this).css("border-radius","6px");
        $(this).css("padding","6px");
        $(this).css("padding-bottom","3px");

        let imageData = $(this).attr('imageSrc');
        $(this).append(`<img 
                         id="${controlId}_UploadedImage" 
                         name="${controlId}_UploadedImage" 
                         tabindex=0 
                         class="UploadedImage"
                         style="width:100%"
                         src="${imageData}"
                         title="Cliquez pour sélectionner un fichier, ou cliquer-déposer une image";
                         waitingImage ="${waitingImage}">`);

        $(this).append(`<input 
                         id="${controlId}_ImageUploader" 
                         type="file" style="visibility:hidden;height:0px;margin:0px !important"
                         accept="${acceptedFileFormat}">`);

        if (newImage) {
            $(this).append(`<input 
                            id="${controlId}" 
                            name="${controlId}" 
                            required
                            RequireMessage ="${missingFileErrorMessage}" 
                            waitingImage ="${waitingImage}">`);
        } else {
            $(this).append(`<input 
                            id="${controlId}" 
                            name="${controlId}" 
                            waitingImage ="${waitingImage}">`);
        }
        
        
        $(`#${controlId}_UploadedImage`).on('dragenter', function (e) {
            $(this).css('border', '2px solid blue');
        });

        $(`#${controlId}_UploadedImage`).on('dragover', function (e) {
            $(this).css('border', '2px solid blue');
            e.preventDefault();
        });

        $(`#${controlId}_UploadedImage`).on('dragleave', function (e) {
            $(this).css('border', '2px solid white');
            e.preventDefault();
        });

        $(`#${controlId}_UploadedImage`).on('drop', function (e) {
            var image = e.originalEvent.dataTransfer.files[0];
            $(this).css('background', '#D8F9D3');
            e.preventDefault();
            let id = $(this).attr('id').split('_')[0];
            let UploadedImage = document.querySelector('#' + id + '_UploadedImage');
            let waitingImage = UploadedImage.getAttribute("waitingImage");
            let ImageData = document.querySelector('#' + id);
            // store the previous uploaded image in case the file selection is aborted
            UploadedImage.setAttribute("previousImage", UploadedImage.src);

            // set the waiting image
            if (waitingImage !== "") UploadedImage.src = waitingImage;
            /* take some delai before starting uploading process in order to let browser to update UploadedImage new source affectation */
            let t2 = setTimeout(function () {
                if (UploadedImage !== null) {
                    let len = image.name.length;

                    if (len !== 0) {
                        let fname = image.name;
                        //console.log(fname)
                        let ext = fname.split('.').pop().toLowerCase();

                        if (!validExtension(ext)) {
                            alert(wrongFileFormatMessage);
                            UploadedImage.src = UploadedImage.getAttribute("previousImage");
                        }
                        else {
                            let fReader = new FileReader();
                            fReader.readAsDataURL(image);
                            fReader.onloadend = () => {
                                UploadedImage.src = fReader.result;
                                ImageData.value = UploadedImage.src;
                                ImageData.setCustomValidity('');
                            };
                        }
                    }
                    else {
                        UploadedImage.src = null;
                    }
                }
            }, 30);
            $(this).css('border', '2px solid white');
            return true;
        });
        ImageUploader_AttachEvent(controlId);
        let controlIdTop = - $(this).height() / 2;
        let controlIdLeft = 4;
        $(`#${controlId}`).css("z-index","-1");
        $(`#${controlId}`).css("height","0px");
        $(`#${controlId}`).css("width","0px");
        $(`#${controlId}`).css("margin","0px");
        $(`#${controlId}`).css("position","relative");
        $(`#${controlId}`).css("left",`${controlIdLeft}px`);
        $(`#${controlId}`).css("top",`${controlIdTop}px`);
    });
}

function ImageUploader_AttachEvent(controlId) {
    // one click will be transmitted to #ImageUploader
    document.querySelector('#' + controlId + '_UploadedImage').
        addEventListener('click', () => {
            document.querySelector('#' + controlId + '_ImageUploader').click();
        });
    document.querySelector('#' + controlId + '_ImageUploader').addEventListener('change', preLoadImage);
}

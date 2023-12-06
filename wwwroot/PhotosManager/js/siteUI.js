let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering

let EmailError = "";
let PasswordError = "";

let Email = "";
let Password = "";
Init_UI();

function Init_UI() {
    renderLogin();

    $("#createProfilCmd").on("click", function () {
        saveContentScrollPosition();
        eraseContent();
        updateHeader("Inscription");
        renderRegister();
    });

    $("#saveUserCmd").on("click", function () {
        saveContentScrollPosition();
        eraseContent();
        updateHeader("Liste de photo");
        renderPhotos();
    });
}
function showWaitingGif() {
    eraseContent();
    $("#content").append(
        $(
            "<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>"
        )
    );
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
        div id="header">
        <span title="Liste des photos" id="listPhotosCmd">
        <img src="images/PhotoCloudLogo.png" class="appLogo">
         </span>
        <span class="viewTitle">Liste des photos
        <div class="cmdIcon fa fa-plus" id="newPhotoCmd" title="Ajouter une photo"></div>
        </span>
        <div class="headerMenusContainer">
        <span>&nbsp;</span> <!--filler-->
        <i title="Modifier votre profil">
        <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
        style="background-image:url('${loggedUser.Avatar}')"
        title="Nicolas Chourot"></div>
        </i>
        <div class="dropdown ms-auto dropdownLayout">
        <!-- Articles de menu -->
        </div>
        </div>
        </div>
        `)
    );
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
            </div>`));
}

function renderLogin(loginMessage = "") {
    eraseContent();
    updateHeader("Connexion");

    let user = createNewUser();

    $("#content").append(
        $(`
            <form class="form" id="loginForm">
            <h3>${loginMessage}</h3>
                <input type='email'
                       name='Email'
                       id= 'Email'
                       class='form-control'
                       required
                       RequireMessage = 'Veuillez entrer votre courriel'
                       InvalidMessage = 'Courriel invalide'
                       placeholder="Adresse de courriel"
                       value='${Email}'>
                <span style='color:red'>${EmailError}</span>
                <input type='password'
                        name='password'
                        placeholder='Mot de passe'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre mot de passe'
                        value='${user.Password}'>
                <span style='color:red'>${PasswordError}</span>
                <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
            </form>
            <div class="form">
                <hr>
                <button class="form-control btn-info" id="createProfilCmd">Nouveau Compte</button>
            </div>      
        `)
    );

    $("#loginForm").on("submit", async function (event) {
        event.preventDefault();
        let user = getFormData($("#loginForm"));
        showWaitingGif();
        Email = user.Email;
        let result = await API.login(user.Email, user.password);
        if (API.currentStatus == 481) {
            EmailError = "Courriel invalide";
        }
        else if (API.currentStatus == 482) {
            PasswordError = "Mot de passe incorrect";
        }
        else {
            EmailError = "";
            PasswordError = "";
        }
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
        writeaccess: 0,
    };
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
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        showWaitingGif(); // afficher GIF d’attente
        let result = await API.register(profil);
        if (result) {
            renderLogin(
                "Votre compte a été créé. Veuillez prendre vos courriels pour récupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion."
            );
        } else {
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

    $("#content").append(
        $(`
            <h1>TEMP PHOTOS PAGE</h1>
        `)
    );
}

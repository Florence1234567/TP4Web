let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering

let EmailError = "";
let PasswordError = "";

let Email = "";
let Password = "";

let result = "";
let loggedUser = false;
Init_UI();

function Init_UI() {
    renderLogin();
    $("#newPhotoCmd").hide();

    $("#createProfilCmd").on("click", function () {
        eraseContent();
        renderRegister();
    });

    $("#saveUserCmd").on("click", function () {
        eraseContent();
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

function updateHeader(headerName) {
    $("#header").empty();

    $("#header").append(
        $(`
        <span title="${headerName}" id="HeaderCmd">
        <img src="images/PhotoCloudLogo.png" class="appLogo">
        </span>
        <span class="viewTitle">${headerName}
        </span>
        `));

    if (loggedUser) {
        $("#header").append(
            $(`
            <div class="headerMenusContainer">
            <span>&nbsp;</span> <!--filler-->
            <i title="Modifier votre profil">
            <div class="UserAvatarSmall" userid="${loggedUser.Id}" id="editProfilCmd"
            style="background-image:url('${loggedUser.Avatar}')"
            title="${loggedUser.Name}"></div>
            </i>
            <div class="dropdown ms-auto dropdownLayout">
            <div data-bs-toggle="dropdown" aria-expanded="false">
            <i class="cmdIcon fa fa-ellipsis-vertical"></i>
            </div>
            <div class="dropdown-menu noselect">
            <span class="dropdown-item" id="manageUserCm">
            <i class="menuIcon fas fa-user-cog mx-2"></i>
            Gestion des usagers
            </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="logoutCmd">
            <i class="menuIcon fa fa-sign-out mx-2"></i>
            Déconnexion
            </span>
            <span class="dropdown-item" id="editProfilMenuCmd">
            <i class="menuIcon fa fa-user-edit mx-2"></i>
            Modifier votre profil
            </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="listPhotosMenuCmd">
            <i class="menuIcon fa fa-image mx-2"></i>
            Liste des photos
            </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="sortByDateCmd">
            <i class="menuIcon fa fa-check mx-2"></i>
            <i class="menuIcon fa fa-calendar mx-2"></i>
            Photos par date de création
            </span>
            <span class="dropdown-item" id="sortByOwnersCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-users mx-2"></i>
            Photos par créateur
            </span>
            <span class="dropdown-item" id="sortByLikesCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-user mx-2"></i>
            Photos les plus aiméés
            </span>
            <span class="dropdown-item" id="ownerOnlyCmd">
            <i class="menuIcon fa fa-fw mx-2"></i>
            <i class="menuIcon fa fa-user mx-2"></i>
            Mes photos
            </span>
            <div class="dropdown-divider"></div>
            <span class="dropdown-item" id="aboutCmd">
            <i class="menuIcon fa fa-info-circle mx-2"></i>
            À propos...
            </span>
            </div>
                </div>
                </div>
                `));

                let result = API.GetAccounts()
        if(API.currentStatus == 401){
            $("#manageUserCm").hide();
        }

        $("#editProfilCmd").on("click", function () {
            renderModify();
        });

        $("#logoutCmd").on("click", function () {
            API.logout();
            Email = "";
            loggedUser = "";
            result = false;
            renderLogin();
        })
    }
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
            </div>`)
    );
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
        console.log(API.GetAccounts());
        event.preventDefault();
        let user = getFormData($("#loginForm"));
        showWaitingGif();
        Email = user.Email;
        result = await API.login(user.Email, user.password);
        if (API.currentStatus == 481) {
            EmailError = "Courriel invalide";
            PasswordError = "";
        }
        else if (API.currentStatus == 482) {
            PasswordError = "Mot de passe incorrect";
            EmailError = "";
        }
        else {
            EmailError = "";
            PasswordError = "";
        }
        if (result) {
            loggedUser = API.retrieveLoggedUser();
            if (loggedUser.VerifyCode === "verified") {
                renderPhotos();
            }
            else {
                renderAccountVerif();
            }
        }
        else {
            renderLogin("Compte introuvable");
        }
    });

    $("#createProfilCmd").on("click", function () {
        eraseContent();
        renderRegister();
    });
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
    `);

    $("#loginCmd").on("click", function () {
        renderLogin();
    }); // call back sur clic
    initFormValidation();
    initImageUploaders();
    $("#abortCmd").on("click", function () {
        renderLogin();
    }); // call back sur clic
    // ajouter le mécanisme de vérification de doublon de courriel
    addConflictValidation(API.checkConflictURL(), 'Email', 'saveUser');

    // call back la soumission du formulaire

    $('#createProfilForm').on("submit", function (event) {
        let profil = getFormData($('#createProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        showWaitingGif(); // afficher GIF d’attente
        createProfil(profil); // commander la création au service API

    });
}

function createProfil(profil) {
    let result = API.register(profil);
    if (result) {
        renderLogin(
            "Votre compte a été créé. Veuillez prendre vos courriels pour récupérer votre code de vérification qui vous sera demandé lors de votre prochaine connexion."
        );
    } else {
        renderLogin("La création du compte a échouée.");
    }
}

function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}

function renderModify() {
    eraseContent();
    updateHeader("Modification du profil");

    initFormValidation();
    initImageUploaders();

    $("#content").append(`
    <form class="form" id="editProfilForm"'>
    <input type = "hidden" name = "Id" id = "Id" value = "${loggedUser.Id}" />
    <fieldset>
        <legend>Adresse ce courriel</legend>
        <input type="email"
            class="form-control Email"
            name="Email"
            id="Email"
            placeholder="Courriel"
            required
            RequireMessage='Veuillez entrer votre courriel'
            InvalidMessage='Courriel invalide'
            CustomErrorMessage="Ce courriel est déjà utilisé"
            value="${loggedUser.Email}" >
            <input class="form-control MatchedInput"
                type="text"
                matchedInputId="Email"
                name="matchedEmail"
                id="matchedEmail"
                placeholder="Vérification"
                required
                RequireMessage='Veuillez entrez de nouveau votre courriel'
                InvalidMessage="Les courriels ne correspondent pas"
                value="${loggedUser.Email}" >
            </fieldset>
            <fieldset>
                <legend>Mot de passe</legend>
                <input type="password"
                    class="form-control"
                    name="Password"
                    id="Password"
                    placeholder="Mot de passe"
                    InvalidMessage='Mot de passe trop court' >
                    <input class="form-control MatchedInput"
                        type="password"
                        matchedInputId="Password"
                        name="matchedPassword"
                        id="matchedPassword"
                        placeholder="Vérification"
                        InvalidMessage="Ne correspond pas au mot de passe" >
                    </fieldset>
                    <fieldset>
                        <legend>Nom</legend>
                        <input type="text"
                            class="form-control Alpha"
                            name="Name"
                            id="Name"
                            placeholder="Nom"
                            required
                            RequireMessage='Veuillez entrer votre nom'
                            InvalidMessage='Nom invalide'
                            value="${loggedUser.Name}" >
                    </fieldset>
                    <fieldset>
                        <legend>Avatar</legend>
                        <div class='imageUploader'
                            newImage='false'
                            controlId='Avatar'
                            imageSrc='${loggedUser.Avatar}'
                            waitingImage="images/Loading_icon.gif">
                        </div>
                    </fieldset>
                    <input type='submit'
                        name='submit'
                        id='saveUserCmd'
                        value="Enregistrer"
                        class="form-control btn-primary">
                    </form>
                    <div class="cancel">
                        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
                    </div>
                    <div class="cancel"> <hr>
                            <button class="form-control btn-warning" id="deleteAccountCmd">Effacer le compte</button>
                            </div>

    `)

    $('#editProfilForm').on("submit", async function (event) {
        loggedUser = getFormData($('#editProfilForm'));
        delete profil.matchedPassword;
        delete profil.matchedEmail;
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        showWaitingGif(); // afficher GIF d’attente
        let result = await API.modifyUserProfil(profil);
        if (result) {
            renderPhotos();
        } else {
            renderModify();
        }
    });

    $('#abortCmd').on("click", function (event) {
        renderPhotos();
    });

    $('#deleteAccountCmd').on("click", function (event) {
        renderRemoveAccount();
    });
}

function renderRemoveAccount() {
    eraseContent();
    updateHeader("Retrait de compte");

    $("#content").append(`
    <div class="viewTitle" style="text-align: center">Voulez-vous vraiment effacer votre compte?</div> 
    <form class="UserdeleteForm">
        <input  type='submit' name='submit' value="Effacer mon compte" class="form-control btn-danger UserdeleteForm">
    </form>
    <div class="UserdeleteForm">
        <button class="form-control btn-secondary" id="abortCmd">Annuler</button>
    </div>
    `);

    $('#UserDeleteForm').on("submit", async function (event) {
        showWaitingGif(); // afficher GIF d’attente
        let result = await API.unsubscribeAccount(loggedUser);
        if (result) {
            API.logout();
            Email = "";
            loggedUser = "";
            result = false;
            renderLogin();
        }
    });

    $('#abortCmd').on("click", function (event) {
        renderModify();
    });
}

function renderAccountVerif() {
    noTimeout(); // ne pas limiter le temps d’inactivité
    eraseContent(); // effacer le conteneur #content
    updateHeader("Vérification"); // mettre à jour l’entête et menu
    $("#content").append(`
    <h3>Veuillez entrer le code de vérification que vous avez reçu par courriel</h3>
    <form class="form" id="validateProfileForm"'>
        <input type="text"
        class="form-control" required
        name="VerificationCode"
        id="VerificationCode"
        placeholder="Code de vérification de courriel"
        required
        RequireMessage = 'Veuillez entrer un code de vérification'
        InvalidMessage = 'Code de vérification invalide'/>
        <input type='submit' name='submit' id='verifCodeCmd' value="Vérifier" class="form-control btn-primary">  
    </form>
  `)

    $('#validateProfileForm').on("submit", async function (event) {
        event.preventDefault();// empêcher le fureteur de soumettre une requête de soumission
        let code = $("#VerificationCode").val();
        let currUser = API.retrieveLoggedUser();
        showWaitingGif(); // afficher GIF d’attente

        console.log(code);
        console.log(API.retrieveLoggedUser());
        let result = await API.verifyEmail(API.retrieveLoggedUser().Id, code)

        if (result && API.currentStatus !== 480) {

            API.eraseLoggedUser();
            currUser.VerifyCode = "verified";
            API.storeLoggedUser(currUser);
            let modified = await API.modifyUserProfil(API.retrieveLoggedUser());

            if (modified && API.currentStatus !== 480) {
                renderPhotos();
            }
            else {
                renderAccountVerif();
            }
        }
        else {
            renderAccountVerif();
        }

    });
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

function sendVerificationEmail() {
    let html = `
                Bonjour ${API.retrieveLoggedUser().Name}, <br /> <br />
                Voici votre code pour confirmer votre adresse courriel.
                <br />
                <h3>${API.retrieveLoggedUser().VerifyCode}</h3>
            `;
    const gmail = new Gmail();
    gmail.send(API.retrieveLoggedUser().Email, 'Vérification de courriel...', html);
}

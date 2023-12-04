let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering

//updateHeader();
//renderLogin();
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
function updateHeader() {
    console.log("Test");
    $("#header").append(
        $(`
            <span title="Connexion" id="ConnexionCmd">
            <img src="images/PhotoCloudLogo.png" class="appLogo">
            </span>
            <span class="viewTitle">Connexion
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

function renderLogin(){
    //eraseContent();
    //UpdateHeader("Connexion", "connexion");
    let EmailError = "Courriel introuvable";
    let passwordError = "Mot de passe incorecte";


    let loginMessage = "";
    let Email = "";
    let password = "";
    $("#content").append(
        $(`
            <h3>${loginMessage}</h3>
            <form class="form" id="loginForm">
                <input type='email'
                       name='Email'
                       class='form-control'
                       required
                       RequireMessage = 'Veuillez entrer votre courriel'
                       InvalidMessage = 'Courriel invalide'
                       placeholder="adresse de courriel"
                       value='${Email}'>
                <span style='color:red'>${EmailError}</span>
                <input type='password'
                        name='password'
                        placeholder='Mot de passe'
                        class="form-control"
                        required
                        RequireMessage = 'Veuillez entrer votre mot de passe'
                        value='${password}'>
                <span style='color:red'>${passwordError}</span>
                <input type='submit' name='submit' value="Entrer" class="form-control btn-primary">
            </form>
            <div class="form">
                <hr>
                <button class="form-control btn-info" id="createProfilCm">Nouveau Compte</button>
            </div>      
        `)
    )
}

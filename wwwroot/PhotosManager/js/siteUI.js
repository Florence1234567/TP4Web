let contentScrollPosition = 0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Views rendering

updateHeader();
function showWaitingGif() {
    eraseContent();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='images/Loading_icon.gif' /></div>'"));
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

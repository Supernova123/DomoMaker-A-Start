const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);
    
    if($("#domoName").val() == '' || $("#domoSpecies").val() == '' || $("#domoColor").val() == '') {
        handleError("RAWR! All fields are required");
        console.log("Maker.js handleDomo -> Empty field called");
        return false;
    }
    
    if($(".domoList").length() >= 6) {
        handleError("RAWR! Only 6 toons to an account!");
        console.log("Maker.js handleDomo -> Max toon limit called");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
        loadDomosFromServer();
    });
    
    return false;
};

const DomoForm = (props) => {
    return (
    <form 
        id="domoForm"
        onSubmit={handleDomo}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
        >
            
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeHolder="Domo Name"/>
            <label htmlFor="species">Species: </label>
            <input id="domoSpecies" type="text" name="species" placeholder="Domo Species"/>
            <label htmlFor="color">Color: </label>
            <input id="domoColor" type="text" name="color" placeHolder="Domo Color"/>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
    </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes=props.domos.map(function(domo) {
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name}</h3>
                <h3 className="domoSpecies"> Species: {domo.species}</h3>
                <h3 className="domoColor"> Color: {domo.color}</h3>
            </div>
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    )
}

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
}

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
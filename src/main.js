
let timerName = "";
let timerDate = null;
function timerStart(name) {
    timerDate = new Date();
    timerName = name;
}
function timerEnd() {
    const d = new Date().getTime() - timerDate.getTime();
    return `<div>${timerName} took ${d} ms</div>`;
}

function testCreateElement(destinationElement, count) {
    for (let i=0; i<count; ++i) {
        const el = document.createElement("div");
        el.setAttribute("style", "color: red");
        el.dataset.world = "foo";
        el.classList.add("bar");
        el.innerText = "My cool content";
        destinationElement.appendChild(el);
    }
}

function testCreateElementBatchAppend(destinationElement, count) {
    const parent = document.createElement("div");
    for (let i=0; i<count; ++i) {
        const el = document.createElement("div");
        el.setAttribute("style", "color: red");
        el.dataset.world = "foo";
        el.classList.add("bar");
        el.innerText = "My cool content";
        parent.appendChild(el);
    }
    destinationElement.appendChild(parent);
}

// Using helper functions to retrieve certain parts of the string, to more closely emulate real-life behaviour

function getStyle() {
    return `color: red;`;
}

function getWorld() {
    return "foo";
}

function getClass() {
    return "bar";
}

function testCreateElementInnerHTML(destinationElement, count) {
    let html = "";
    for (let i=0; i<count; ++i) {
        html += `<div class="${getClass()}" style="${getStyle()}" data-world="${getWorld()}">My cool content</div>`;
    }
    destinationElement.innerHTML = html;
}

function runTests(destinationElement, count) {
    let output = "";

    destinationElement.innerHTML = "";
    timerStart("document.createElement");
    testCreateElement(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    timerStart("document.createElement (appended to DOM at the end through parent)");
    testCreateElementBatchAppend(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    timerStart("element.innerHTML");
    testCreateElementInnerHTML(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    document.querySelector("#container-output").innerHTML = output;
}

function testCreateElementRef(destinationElement, count) {
    const els = [];
    for (let i=0; i<count; ++i) {
        const el = document.createElement("div");
        els.push(el);
        el.setAttribute("id", `el-${i}`);
        el.setAttribute("style", "color: red");
        el.dataset.world = "foo";
        el.classList.add("bar");
        el.innerText = "My cool content";
        destinationElement.appendChild(el);
    }
    for (const el of els) {
        el.innerText = "My cool content which is now different!";
    }
}

function testCreateElementInnerHTMLRef(destinationElement, count) {
    let html = "";
    for (let i=0; i<count; ++i) {
        html += `<div id="el-${i}" class="${getClass()}" style="${getStyle()}" data-world="${getWorld()}">My cool content</div>`;
    }
    destinationElement.innerHTML = html;
    for (let i=0; i<count; ++i) {
        const el = destinationElement.querySelector(`#el-${i}`);
        el.innerText = "My cool content which is now different!";
    }
}

function runTestsRef(destinationElement, count) {
    let output = "";

    destinationElement.innerHTML = "";
    timerStart("document.createElement");
    testCreateElementRef(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    timerStart("element.innerHTML");
    testCreateElementInnerHTMLRef(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    document.querySelector("#container-output-ref").innerHTML = output;
}

function testCreateElementEv(destinationElement, count) {
    for (let i=0; i<count; ++i) {
        const el = document.createElement("div");
        el.setAttribute("style", "color: red");
        el.dataset.world = "foo";
        el.classList.add("bar");
        el.innerText = "My cool content";
        el.addEventListener("click", () => {
            console.log(el);
        });
        destinationElement.appendChild(el);
    }
}

function clb() {
    console.log(this);
}

function testCreateElementEvThis(destinationElement, count) {
    for (let i=0; i<count; ++i) {
        const el = document.createElement("div");
        el.setAttribute("style", "color: red");
        el.dataset.world = "foo";
        el.classList.add("bar");
        el.innerText = "My cool content";
        el.addEventListener("click", clb);
        destinationElement.appendChild(el);
    }
}

function testCreateElementInnerHTMLEv(destinationElement, count) {
    let html = "";
    for (let i=0; i<count; ++i) {
        html += `<div class="${getClass()}" style="${getStyle()}" data-world="${getWorld()}">My cool content</div>`;
    }
    destinationElement.innerHTML = html;
    destinationElement.addEventListener("click", e => {
        if (e.target.classList.includes(getClass())) {
            console.log(e.target);
        }
    });
}

function runTestsEv(destinationElement, count) {
    let output = "";

    destinationElement.innerHTML = "";
    timerStart("document.createElement (closure)");
    testCreateElementEv(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    timerStart("document.createElement (static function using <code>this</code>)");
    testCreateElementEvThis(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    timerStart("element.innerHTML");
    testCreateElementInnerHTMLEv(destinationElement, count);
    output += timerEnd();

    destinationElement.innerHTML = "";
    document.querySelector("#container-output-ev").innerHTML = output;
}

window.addEventListener("DOMContentLoaded", () => {
    const $container = document.querySelector("#container-inserted-elements");
    document.querySelector("#btn-begin").addEventListener("click", () => {
        runTests($container, parseInt(document.querySelector("#input-iterations").value));
    });

    document.querySelector("#btn-begin-ref").addEventListener("click", () => {
        runTestsRef($container, parseInt(document.querySelector("#input-iterations-ref").value))
    });

    document.querySelector("#btn-begin-ev").addEventListener("click", () => {
        runTestsEv($container, parseInt(document.querySelector("#input-iterations-ev").value))
    });
});

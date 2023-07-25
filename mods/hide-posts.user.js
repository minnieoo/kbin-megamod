async function wipeArray () {
    await safeGM("setValue","hidden-posts","[]")
}
async function setArray () {
    const val = await safeGM("getValue","hidden-posts")
    if(val) {
        setup(val)
    } else {
        await safeGM("setValue","hidden-posts","[]")
        setup('[]')
    }
}
async function addToArr (idArr,toHideID) {
    idArr.push(toHideID)
    console.log("pushing to PERMA GM storage:",toHideID)
    const updatedArr = JSON.stringify(idArr)
    await safeGM("setValue","hidden-posts",updatedArr)
}
function teardown (hp) {
    $('.kes-hide-posts').hide();
    for (i = 0; i < hp.length; ++i) {
        console.log("showing hidden post", hp[i])
        console.log(hp[i])
        const toShow = document.querySelector('#entry-' + hp[i]);
        console.log(toShow)
        $(toShow).show();
    }
    let hideThisPage = []
    console.log("emptying array")
    storeCurrentPage(hideThisPage);
    wipeArray();
}
async function fetchCurrentPage () {
    const hp = await safeGM("getValue","hide-this-page");
    if (hp) {
        teardown(hp);
       }
}
async function storeCurrentPage (hideThisPage) {
    console.log("GM storage received:", hideThisPage)
    await safeGM("setValue","hide-this-page",hideThisPage)
}
function setup (array) {
    const hideThisPage = []
    const rawIdArr = array;
    const idArr = JSON.parse(rawIdArr);
    const posts = document.querySelectorAll('#content .entry')
    posts.forEach((item) => {
        const entryID = item.id.split('-')[1]
        if (idArr.includes(entryID)) {
            $(item).hide();
            hideThisPage.push(entryID)
        } else {
            const toHide = item.querySelector('.kes-hide-posts');
            if (toHide) {
                console.log("hide button already on page, re-showing")
                $(toHide).show();
                return
            }
            const hideButtonHolder = document.createElement('li');
            const hideButton = document.createElement('a');
            hideButtonHolder.appendChild(hideButton)
            hideButton.className = "stretched-link kes-hide-posts"
            hideButton.innerText = "hide post";
            hideButton.setAttribute("hide-post-id",entryID);
            const footer = item.querySelector('footer menu');
            footer.appendChild(hideButtonHolder);
            hideButton.addEventListener('click',(event) => {
                const toHideID = event.target.getAttribute("hide-post-id");
                const toHide = document.querySelector('#entry-' + toHideID);
                console.log("hiding post:",toHide)
                $(toHide).hide();
                hideThisPage.push(toHideID)
                console.log("sending ID to PERMA GM storage:",toHideID)
                addToArr(idArr,toHideID);
                console.log("sending array to TEMP GM storage:",hideThisPage)
                storeCurrentPage(hideThisPage)
            });
        }
    });

}
function hidePostsInit (toggle) {
    if (toggle) {
        setArray();
    } else {
        fetchCurrentPage();
    }
}
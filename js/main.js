const app = new ProductController(new ProductModel(), new ProductView());
const routes = [
    { path: '/', action: 'add'},
    { path: '/list', action: 'list'},
    { path: '/search', action: 'search'},
];

// GET THE CURRENT ROUTE (WE USE THE LOCATION OBJECT AND ITS PROPERTY HASH). IF "" || '/' THEN parseLocation = '/')
const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

// WE WILL LOOK FOR ACTION IN THE ARRAY routes THAT CORRESPONDS TO THE ROUTE WITH FIND
const findActionByPath = (path, routes) => routes.find(r => r.path == path || undefined);

const router = () => {
    // OBTAIN ACTUAL ROUTE
    const path = parseLocation();
    // OBTAIN ACTUAL ACTION
    const { action = 'error' } = findActionByPath(path, routes) || {};
    // CALL TO THE CORRESPONDING METHOD FOR THE ACTION FOUND
    console.log(path, action);
    switch (action) {
        case 'add':
            app.add('#app');
            break;
        case 'list':
            app.list('#app');
            break;
        case 'search':
            app.search('#app');
            break;
        default:
            ErrorComponent('#app');
            break;
    }
}

// EVERY TIME THAT A PAGE LOAD IS DETECTED, ROUTER FUNCTION IS CALLED
$(window).on('load', function() {
    router();
});

// EVERY TIME THAT A HASH CHANGE IS DETECTED (FOR EXAMPLE URL CHANGES FROM #/page1 TO #/page2) THEN ROUTER FUNCTION IS CALLED
$(window).on('hashchange', function() {
    router();
});
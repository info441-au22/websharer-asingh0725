import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'

const appSettings = {
    appCredentials: {
        clientId: "810466f0-a38e-49c2-8ba3-f6dfb6390dbd",
        tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret:  ".p~8Q~MjhVWcam3PrEr~BexEgzyX4Q5uY.-LqaXy"
    },	
    authRoutes: {
        redirect: "https://www.aviraj-singh.me/redirect",
        error: "/error",
        unauthorized: "/unauthorized"
    }
};

import apiv1Router from './routes/api/v1/apiv1.js';
import apiv2Router from './routes/api/v2/apiv2.js';
import apiv3Router from './routes/api/v3/apiv3.js';
import usersRouter from './routes/api/v3/controllers/users.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import models from './models.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(sessions({
    secret: "a secret",
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60 * 24},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

app.use((req, res, next) => {
    req.models = models
    next();
})

app.use('/api/v1', apiv1Router);
app.use('/api/v2', apiv2Router);
app.use('/api/v3', apiv3Router);

app.use('/users', usersRouter);

app.get('/signin', 
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Permission denied")
})

export default app;

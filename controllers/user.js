const User = require('../models/user')
module.exports.registerPage = (req,res)=>{
    res.render('users/register')
}

module.exports.renderUserPage = (req, res)=>{
    res.render('users/login')
}

module.exports.registerUser = async(req,res)=>{
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username})
        const registerUser = await User.register(user, password)
        req.login(registerUser, err=>{
            if(err){
                return next(err);
            }
            req.flash('success','welcome')
            res.redirect('/campgrounds')
        })
        
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }    
}

module.exports.renderLoginPage = (req, res)=>{
    res.render('users/login')
}
module.exports.login = (req,res)=>{
    req.flash('success','welcome back')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}
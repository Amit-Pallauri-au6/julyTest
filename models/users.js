const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')
const { hash, compare } = require('bcrypt')

class User extends Model {
    static async findByEmailAndPassword(email, password) {
        try {
            const user = await User.findOne({
              where: {
                email
              }
            });
            if (!user) throw new Error("can not find user by that email");  
            const isMatched = await compare(password, user.password);
            if (!isMatched) throw new Error("Incorrect credentials");
            return user;
        }catch (err) {
            throw err;
        }    
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey: true
    },
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },
    password : {
        type : DataTypes.TEXT,
        allowNull: false,
    },
    token : {
        type: DataTypes.STRING(1234)
    }
}, {
    sequelize,
    modelName: 'user'
})

sequelize.sync({
    force: true
})

User.beforeCreate( async user => {
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword
})

User.beforeUpdate(async user => {
    if (user.changed("password")) {
      const hashedPassword = await hash(user.password, 10);
      user.password = hashedPassword;
    }
});


module.exports = User
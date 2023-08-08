module.exports =
{
    secretKey: "esunsecreto"
}

/*
*Le estaba pasando un objeto y no un string a la firma del token, por lo tanto el sign debe ser con un string, (se logro
*cuando busque adentro del objeto el String).
*/
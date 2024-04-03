/* Comandos previos */
// Utilizar base de datos github (equivale a use github en MongoSH)
db = db.getSiblingDB("github");
// Obtener todos los documentos
db.getCollection("commits").find({});

/* 1. Listar el número total de commits recuperados*/
db.getCollection('commits').countDocuments({});

/* 2. Listar el número total de commits recuperados por cada uno de los repositorios GitHub */
db.getCollection('commits').aggregate([{"$group" : {_id:"$projectId", commits:{$sum:1}}}]);

/* 3. Listar todos los commits para el proyecto 'sourcegraph' */
db.getCollection("commits").find({ "projectId" : "sourcegraph" });

/* 4. Listar solo fecha y mensaje de cada commit para el proyecto 'sourcegraph' y ordenarlo por orden cronológico. */
db.getCollection("commits").aggregate([
    {
        $match:{
            projectId:"sourcegraph"
        }
    },
    {
        $project: {
            "date": "$commit.committer.date",
            "message": "$commit.message",
            "_id": 0
        }
    },
    {
        $sort: {"date":1}
    }
])

/* 5. Listar los commits que se realizaron el 10 de febrero de 2023 para el proyecto 'sourcegraph' */
db.getCollection("commits").find({"commit.committer.date" : {$regex:"^2023-02-10"}, "projectId" : "sourcegraph"});

/* 6. Listar el top 5 de los desarrolladores con más commits en el proyecto 'sourcegraph' */
db.getCollection("commits").aggregate([
    {
        $match:{
            projectId:"sourcegraph"
        }
    },
    {
        $group:{
            _id:"$commit.author.name", num_commits:{$sum:1}
        }
    },
    {
        $sort: {"num_commits":-1}
    },
    {
        $limit: 5
    }
])
/* 7. Calcular, para el proyecto 'sourcegraph' la media de las estadísticas en los commits
    (referidas al total de cambios en ficheros por cada commits y en particular, las adiciones y los borrados de líneas) */
db.getCollection("commits").aggregate([
    {
        $match:{
            projectId:"sourcegraph"
        }
    },
    {
        $group: {
            "_id": null,
            "total": {$avg : "$stats.total"},
            "adds": {$avg : "$stats.additions"},
            "dels": {$avg : "$stats.deletions"}
        }
    },
    {
        $project: {
            "avgTotal": "$total",
            "avgAdds": "$adds",
            "avgDels": "$dels",
            "_id": 0
        }
    }
])

/* 7 MÉTODO 2 */
db.getCollection("commits").aggregate([
    {
        $match:{
            projectId:"sourcegraph"
        }
    },
    {
        $group: {
            "_id": null,
            "total": {$sum : "$stats.total"},
            "adds": {$sum : "$stats.additions"},
            "dels": {$sum : "$stats.deletions"}
        }
    },
    {
        $project: {
            "avgTotal": { $divide: ["$total", db.getCollection('commits').countDocuments({})]},
            "avgAdds": { $divide: ["$adds", db.getCollection('commits').countDocuments({})]},
            "avgDels": { $divide: ["$dels", db.getCollection('commits').countDocuments({})]},
            "_id": 0
        }
    }
])

/* 8. Calcular las mismas estadísticas que en el apartado anterior, pero para cada committer en el proyecto, ordenándolo por aquellos que hacen commits más grandes de media */
db.getCollection("commits").aggregate([
    {
        $match:{
            projectId:"sourcegraph"
        }
    },
    {
        $group: {
            "_id": "$author.login",
            "total": {$avg : "$stats.total"},
            "adds": {$avg : "$stats.additions"},
            "dels": {$avg : "$stats.deletions"}
        }
    },
    {
        $sort: {"total":-1}
    }
])

/* 9. Para el desarrollador con commits más grandes, listar todos los ficheros que ha modificado en cualquier de sus commits */
var commiter = db.getCollection("commits").aggregate([
    {
        $match:{
            projectId:"sourcegraph"
        }
    },
    {
        $group: {
            "_id": "$author.login",
            "total": {$avg : "$stats.total"},
            "adds": {$avg : "$stats.additions"},
            "dels": {$avg : "$stats.deletions"}
        }
    },
    {
        $sort: {"total":-1}
    },
    {
        $limit : 1
    },
    {
        $project: {
            total : 0, adds : 0, dels : 0, _id : 1
        }
    }
]).toArray()

db.getCollection("commits").aggregate([
    {
        $match:{
            "author.login" : commiter[0]._id
        }
    },
    {
        $project: {
            "files" : "$files.filename",
        }
    }
])
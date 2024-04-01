# P4
## Consultas de commits en Mongo DB

### Enunciado:
Realizar las siguientes consultas con la información de commits guardada en MongoDB de la
práctica anterior:
1. Listar el número total de commits recuperados.
2. Listar el número total de commits recuperados por cada uno de los repositorios GitHub.
3. Listar todos los commits para el proyecto 'sourcegraph'.
4. Listar solo fecha y mensaje de cada commit para el proyecto 'sourcegraph' y ordenarlo por orden cronológico.
5. Listar los commits que se realizaron el 10 de febrero de 2023 para el proyecto 'sourcegraph'.
6. Listar el top 5 de los desarrolladores con más commits en el proyecto 'sourcegraph'.
7. Calcular, para el proyecto 'sourcegraph' la media de las estadísticas en los commits (referidas al total de cambios en ficheros por cada commits, y en particular, las adiciones y los borrados de líneas)
8. Calcular las mismas estadísticas que en el apartado anterior, pero para cada committer en el proyecto, ordenándolo por aquellos que hacen commits más grandes de media
9. Para el desarrollador con commits más grandes, listar todos los ficheros que ha modificado en cualquier de sus commits.

### Entregar:
* Una memoria breve con todas las explicaciones paso a paso y las evidencias de los resultados obtenidos.
* Se debe aportar el fichero *.js con el código de las consultas MongoDB.
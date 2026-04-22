# Visualizador de nifti

Visualizador de Nifti hecho en React usando Niivue


Para ejecutar los comandos posicionarse dentro de la carpeta app

## Para correr el programa

```
npm run dev
```

o usando docker

```
docker compose -f docker-compose.dev.yml up --build
```

## Tests

El repositorio cuenta con multiples tests tanto unitarios como e2e usando las librerias vitest y playwrigth respectivamente. 

Para ejecutar los tests se debe usar:

```
npm run tests
```

En el caso de que se quieran ejecutar solo los tests unitarios:

```
npm run tests:unit
```

Para ejecutar los tests e2e:

```
npm run tests:e2e
```

o si se quiere usar la interfaz grafica de playwrigth al ejecutar los tests usar:


```
npm run tests:e2e:ui 
```

o

```
npm run tests:e2e -- --ui
```
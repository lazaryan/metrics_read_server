# Metrics stream

Проект для лабораторных работ по взаимодействию с датчиками и визуализации данных.

Серверная часть приложения запускается на `Raspberry Pi` для возможности подключения различных датчиков и добавления новых метрик для считывания.

## Какие метрики доступны сейчас

1) график рандомных чисел
2) считывание температуры CPU (работает только на linux)
3) считывание температуры GPU (работает только с видеокартами от NVidia)

## Какие метрики планируем добавить

1) датчик температу и влажности воздуха `DHT11`

## Что необходимо

- OS Windows/Linux
- Node.js LTS Version (14+)

## Используемые бибилотеки/технолонии

***Front***:

1) `Custom-components`
2) фреймворк `Svelte`
3) сборщик проекта `Vite`
4) `TypeScript`

***Back***:

1) фреймворк `Fastify`
2) `TypeScript`
3) `WebSockets`

## Как начать

Перед началом работы необходимо скачать все зависимости. Для этого выполните команду

```bash
npm run install_all
```

Для дальнейшей работы необходимо запустить 2 сервера:

1) основной сервер
2) `api getaway` сервер, доступный в сети

Для этого необохдимо открыть 2 терминала и выполнить команды:

1 терминал -

```bash
npm run back
```

2 терминал -

```bash
npm run front
```

Дальше приложение будет доступно на `3001` порту.

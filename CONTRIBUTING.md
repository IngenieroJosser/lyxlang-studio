# Guía para Contribuir a LyxLang Studio

¡Gracias por tu interés en mejorar **LyxLang Studio**! 🚀  
Este proyecto es **open source** y depende de personas como tú para crecer, evolucionar y seguir inspirando a la comunidad developer.  

---

## Filosofía del Proyecto

LyxLang Studio busca ser una plataforma abierta donde cualquier developer pueda **crear, colaborar y ganar**.  
Nuestro objetivo es construir una experiencia transparente, inclusiva y de alto rendimiento, directamente desde el navegador.

Queremos que cada contribución, sin importar su tamaño, ayude a que más personas descubran el poder de construir en comunidad. 

---

## 🧩 Cómo contribuir

1. **Haz un fork** del repositorio  
   ```bash
   git fork https://github.com/tu-usuario/lyxlang-studio
   ```
2. **Clona tu fork localmente**  
   ```bash
   git clone https://github.com/tu-usuario/lyxlang-studio
   ```
3. **Crea una rama nueva** para tu cambio  
   ```bash
   git checkout -b feature/nueva-funcion
   ```
4. **Realiza tus cambios** y asegúrate de seguir el estilo del proyecto  
5. **Haz commit** con un mensaje claro y descriptivo  
   ```bash
   git commit -m "feat: agrega nueva función de recompensas"
   ```
6. **Envía tus cambios**  
   ```bash
   git push origin feature/nueva-funcion
   ```
7. **Abre un Pull Request (PR)** desde tu fork hacia `main` o `development`  
   Explica el propósito, cambios realizados y cómo probarlos.

---

## Estilo de Código

- El proyecto está construido con **Next.js**, **TypeScript** y **TailwindCSS**  
- Usa **ESLint** y **Prettier** antes de hacer commit  
- Sigue la convención de commits:  
  - `feat:` para nuevas funcionalidades  
  - `fix:` para correcciones de errores  
  - `docs:` para cambios en documentación  
  - `style:` para formato o estilo de código  
  - `refactor:` para reestructuración de código  
  - `test:` para tests  
  - `chore:` para tareas menores

Ejemplo:
```bash
git commit -m "fix: corrige bug en ejecución de monaco-editor"
```

---

## Tests

Si tu contribución afecta la lógica del código:
- Agrega o actualiza los tests en la carpeta `/tests`
- Asegúrate de que todo pasa antes de subir tu PR:  
  ```bash
  npm run test
  ```

---

## Reportar Issues

Si encuentras un bug o tienes una idea:
1. Verifica que no exista un **issue** similar en [GitHub Issues](https://github.com/tu-usuario/lyxlang-studio/issues)
2. Crea un nuevo **issue** con:
   - Descripción clara del problema o mejora
   - Pasos para reproducirlo (si aplica)
   - Capturas o logs relevantes
   - Versión del navegador o entorno

---

## Comunicación

Únete a la conversación en nuestras plataformas oficiales:
- GitHub Discussions → [link cuando esté disponible]
- X (Twitter): [@LyxLangDev](https://x.com/LyxLangDev)
- Discord: próximamente  

Si tienes dudas sobre cómo contribuir o una propuesta mayor, puedes escribir a:  
 **community@lyxlang.dev**

---

## Agradecimientos

Cada contribución cuenta, desde una corrección de typo hasta una nueva feature.  
Tu tiempo, esfuerzo y feedback ayudan a que LyxLang Studio siga creciendo como una comunidad abierta y apasionada.

✨ *Crea. Colabora. Gana. — LyxLang Studio Team*

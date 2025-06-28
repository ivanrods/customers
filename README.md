# 👥 Customers - API para Gerenciamento de Clientes

**Customers** é uma aplicação backend desenvolvida com **Node.js** e **Express** que oferece uma API completa para gerenciamento de clientes (customers), usuários, contatos, upload de imagens e autenticação.  

Projetada para ser segura, escalável e fácil de integrar, essa API utiliza **Sequelize** com banco de dados **PostgreSQL**, além de recursos como envio de e-mails, autenticação JWT e upload de arquivos com Multer.

## 🚀 Funcionalidades

✅ Cadastro e login de usuários  
✅ Cadastro, listagem, edição e exclusão de clientes  
✅ Gerenciamento de contatos vinculados aos clientes  
✅ Upload de imagens com Multer  
✅ Autenticação com tokens JWT  
✅ Criptografia de senhas com Bcrypt  
✅ Envio de e-mails com Nodemailer  
✅ Fila de envio com Bee-Queue  
✅ Validação de dados com Yup  
✅ Tratamento de erros com Youch  

## 🛠️ Tecnologias Utilizadas

- ⚙️ **Node.js** com **Express**  
- 🗄️ **PostgreSQL** com **Sequelize** ORM  
- 🔐 **JWT (jsonwebtoken)** para autenticação  
- 🔒 **bcryptjs** para hashing de senhas  
- 📦 **multer** para upload de imagens  
- 📤 **nodemailer** e **bee-queue** para envio de e-mails em fila  
- 📅 **date-fns** para manipulação de datas  
- ✅ **yup** para validação de dados  
- 🐞 **youch** para tratamento elegante de erros  
- 🌿 **dotenv** para gerenciamento de variáveis de ambiente  

## 📂 Como rodar o projeto  
- yarn install
- npm run dev
### 1️⃣ Clone o repositório  
```bash
git clone https://github.com/ivanrods/customers-backend
cd customers-backend

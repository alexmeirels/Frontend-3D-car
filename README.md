# Frontend-3D-car

Objetivo do projeto é criar um tela com um mapa que fará a animação da imagem no sprite baseada na direção do carro.

Primeiramente, foi criado o projeto e instalado as depedências do React. Depois da instalação, eu gerei um mapa da Mapbox e criei 
duas marcações de início da rota e final da rota. Logo após, criei uma marcação para cada latitude/longitude para representar o caminho 
que o carro percorreria. Assim, para cada segundo de tempo iria gerar uma nova marcação e iria ocultar a marcação anterior, fazendo o 
movimento do carro pela rota. Além disso, eu coloquei a internacionalização de texto e adicionei as outras rotas. Não consegui utilizar a 
API do map box para colocar o trajeto no qual o carro passaria e devido a uma falha da própria biblioteca do mapbox, eu não consegui 
retirar as marcações que marcam o inicio da rota e o final da rota, sendo assim optei por apenas esconde-las. A minha maior dificuldade foi com a manipulação da biblioteca do Mapbox.

As tecnologias usadas foram: React e Mapbox. Escolhi React por ser um framework que eu ja tive contato e o Mapbox foi escolhido por 
recomendação.

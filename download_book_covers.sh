#!/bin/bash

# Création du dossier de destination s'il n'existe pas
mkdir -p public/assets/books

# Téléchargement des images pour Chef de Projet
curl -o "public/assets/books/scrum.jpg" "https://m.media-amazon.com/images/I/51szD9HC9pL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/pmbok.jpg" "https://m.media-amazon.com/images/I/51r0H4yN0HL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/lean-thinking.jpg" "https://m.media-amazon.com/images/I/51CE44+iIBL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/phoenix-project.jpg" "https://m.media-amazon.com/images/I/51-J1fXQrgL._SX330_BO1,204,203,200_.jpg"

# Téléchargement des images pour Formateur
curl -o "public/assets/books/make-it-stick.jpg" "https://m.media-amazon.com/images/I/51T4E1zU0dL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/teaching-what-you-dont-know.jpg" "https://m.media-amazon.com/images/I/51vfL+wJ7FL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/design-for-learning.jpg" "https://m.media-amazon.com/images/I/51xnrM9ZQdL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/training-back-room.jpg" "https://m.media-amazon.com/images/I/51QxA+3ds9L._SX330_BO1,204,203,200_.jpg"

# Téléchargement des images pour Sales Team Manager
curl -o "public/assets/books/challenger-sale.jpg" "https://m.media-amazon.com/images/I/51DjwrrKaxL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/sales-management.jpg" "https://m.media-amazon.com/images/I/51f02uE042L._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/sales-code.jpg" "https://m.media-amazon.com/images/I/51N-u8AsmdL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/sales-champions.jpg" "https://m.media-amazon.com/images/I/51y8mrg3NHL._SX330_BO1,204,203,200_.jpg"

# Téléchargement des images pour Développeur React JS
curl -o "public/assets/books/road-to-react.jpg" "https://m.media-amazon.com/images/I/41GvpIh7yFL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/react-patterns.jpg" "https://m.media-amazon.com/images/I/51Q43WRXJzL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/testing-react.jpg" "https://m.media-amazon.com/images/I/51CXhW8d9yL._SX330_BO1,204,203,200_.jpg"
curl -o "public/assets/books/react-performance.jpg" "https://m.media-amazon.com/images/I/51w+YTpi2HL._SX330_BO1,204,203,200_.jpg" 
FROM openjdk:8-jre
COPY application.yml application.yml
COPY golfworld.jar golfworld.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","golfworld.jar"]
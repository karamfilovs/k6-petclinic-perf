# k6-petclinic-perf
## Preconditions: 
```shell
git clone https://github.com/spring-petclinic/spring-petclinic-rest.git
cd spring-petclinic-rest
./mvnw spring-boot:run
```

## Run the test with: 
```shell 
k6 run petclinic.js```
## Run the test with different duration and users: 
```shell 
k6 run --duration 100s --vus 100 petclinic.js
```

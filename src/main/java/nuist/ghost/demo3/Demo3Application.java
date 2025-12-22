package nuist.ghost.demo3;
/**
 * @author Chuhang Zhang 张初航
 * @Description: Spring Boot application main class that contains the main method to run the application.
 *               Annotated with @SpringBootApplication to enable auto-configuration and component scanning.
 *               Running the main method of this class starts the Spring Boot application.
 */

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Demo3Application {

    public static void main(String[] args) {
        SpringApplication.run(Demo3Application.class, args);
    }

}

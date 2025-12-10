package nuist.ghost.demo3.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UIController {

    @GetMapping("/ui")
    public String ui(){
        return "redirect:/ui/index.html";
    }

    @GetMapping("/")
    public String root(){
        return "redirect:/root/index.html";
    }

    @GetMapping("/menu")
    public String menu(){
        return "redirect:/menu/index.html";
    }
}

package nuist.ghost.demo3.controller;
/**
 * @author Chuhang 张初航
 * @description Provide all the API for front-end
 *              to manage members, including exporting data,
 *              All of the controller classes are defined in this package
 */

import nuist.ghost.demo3.service.MemberService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    private final MemberService memberService;

    public TestController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping("/test")
    public String test() {
        long count = memberService.getAllMembers().size();
        return "Spring Boot应用运行正常！当前有 " + count + " 个成员在数据库中。";
    }
}


package nuist.ghost.demo3.controller;

import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@RestController
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping ("/api/members")
    //GetMapping 注解表示该方法处理GET请求到根路径
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberByID(@PathVariable Long id){
        Optional<Member> member = memberService.getMemberByID(id);
        return member.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/regular") //POST请求 处理 /regular 路径 创建普通成员
    public Member createRegularMember(@RequestParam String name, @RequestParam String studentID){
        //@RequestParam 注解表示从请求参数中获取 name 和 studentID
        //如何输入请求参数？：在URL中添加参数，例如：http://localhost:8080/regular?name=张三&studentID=2021001
        //但是这样的交互方法不太好，建议使用Postman等工具发送POST请求，或者通过前端页面提交表单数据
        //如何使用前端页面提交表单数据？：在HTML页面中添加表单，并设置提交地址为 /regular
        // 表单中添加 name 和 studentID 两个输入框，并设置提交按钮的提交地址为 /regular
        // 这样用户填写表单后，点击提交按钮即可发送POST请求到 /regular 路径
        // 这样，用户填写表单后，点击提交按钮，即可创建一个普通成员
        // 请给出示例：<form action="/regular" method="post">
        // 写在哪里呢？：可以写在UIController中，或者单独创建一个HTML页面
        // 如何单独创建？：在resources/templates目录下创建一个HTML文件，例如create_member.html
        // template和static目录的区别？：static目录下的文件是静态文件，不会被SpringBoot处理，例如HTML文件，CSS文件，JavaScript文件
        // template目录下的文件是动态文件，会被SpringBoot处理，例如Java文件，XML文件，配置文件
        // 那你为何让我在templates下创建HTML文件？：因为templates目录下的HTML文件可以使用Thymeleaf等模板引擎进行动态渲染
        // 这样可以根据不同的条件渲染不同的内容。
        // 什么是Thymeleaf？：Thymeleaf是一个模板引擎，它可以根据模板生成HTML，Java文件，XML文件，配置文件
        // 这样可以根据不同的条件渲染不同的内容。
        Member member = new Member(name, studentID){
            @Override
            public String getMemberType() {
                return "RegularMember";
            }
        };
        return memberService.createMember(member);
    }

    @PostMapping("/sectionHead")
    public Member createSectionHead(@RequestParam String name, @RequestParam String studentID){
        Member member = new Member(name, studentID){
            @Override
            public String getMemberType() {
                return "SectionHead";
            }
        };
        return memberService.createMember(member);
    }


    @PostMapping("/president")
    public Member createPresident(@RequestParam String name, @RequestParam String studentID){
        Member member = new Member(name, studentID){
            @Override
            public String getMemberType() {
                return "President";
            }
        };
        return memberService.createMember(member);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member memberDetails){
        Optional<Member> existingMember = memberService.getMemberByID(id);
        if (existingMember.isPresent()) {
            Member member = existingMember.get();
            member.setName(memberDetails.getName());
            member.setInterviewScore(memberDetails.getInterviewScore());
            member.setInternshipScore(memberDetails.getInternshipScore());
            member.setSalaryScore(memberDetails.getSalaryScore());
            member.setProbation(memberDetails.isProbation());

            Member updatedMember = memberService.updateMember(member);
            return ResponseEntity.ok(updatedMember);
        }
        return ResponseEntity.notFound().build();
    }
}

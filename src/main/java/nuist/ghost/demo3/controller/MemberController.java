package nuist.ghost.demo3.controller;
/**
 * @author Chuhang 张初航
 * @description Provide all the API for front-end
 *              to manage members, including exporting data,
 *              All of the controller classes are defined in this package
 */

import nuist.ghost.demo3.dto.CreateMemberRequest;
import nuist.ghost.demo3.dto.UpdateMemberRequest;
import nuist.ghost.demo3.entities.Member;
import nuist.ghost.demo3.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public Member getMemberByID(@PathVariable Long id) {
        return memberService.getMemberByID(id);
    }

    @GetMapping("/name/{name}")
    public List<Member> getMembersByName(@PathVariable String name) {
        return memberService.getMembersByName(name);
    }

    @GetMapping("/student-id/{studentID}")
    public Member getMemberByStudentID(@PathVariable String studentID) {
        return memberService.getMemberByStudentID(studentID);
    }

    @GetMapping("/probation/official")
    public List<Member> getOfficialMembers() {
        return memberService.getMembersByIsProbation(false);
    }

    @GetMapping("/probation/intern")
    public List<Member> getProbationMembers() {
        return memberService.getMembersByIsProbation(true);
    }

    @GetMapping("/internship-score-greater-than/{score}")
    public List<Member> getMembersByInternshipScoreGreaterThan(@PathVariable double score) {
        return memberService.getMembersByInternshipScoreGreaterThan(score);
    }

    @GetMapping("/position/{position}")
    public List<Member> getMembersByPositon(@PathVariable String position){
        return memberService.getMembersByPositon(position);
    }




    @PostMapping //创建成员 Create Member
    public Member createMember(@RequestBody CreateMemberRequest request) {
        return memberService.createMember(request);
    }

    @PutMapping("/{id}")  //更新   成员信息 Update Member Info
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody UpdateMemberRequest request) {
        /* 更新成员信息 Update Member Info */
        Member updatedMember = memberService.updateMember(id, request);
        return ResponseEntity.ok(updatedMember);
    }

    @DeleteMapping("/{id}") //删除    成员 Delete Member
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        /* 删除成员 Delete Member */
        memberService.deleteMember(id);
        return ResponseEntity.noContent().build();
    }
}


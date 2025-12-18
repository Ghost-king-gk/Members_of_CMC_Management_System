package nuist.ghost.demo3.controller;
/**
 * @author Chuhang 张初航
 * @discription 管理员成员管理控制器 provide all the API for front-end
 */

import nuist.ghost.demo3.service.MemberService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/members")
public class AdminMemberController {

    private final MemberService memberService;

    public AdminMemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/export")
    public ResponseEntity<Void> exportToJson() {
        memberService.exportMembersToJson();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sample")
    public ResponseEntity<Void> createSampleData() {
        memberService.createSampleData();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllMembers() {
        memberService.deleteAllMembers();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/promote")
    public ResponseEntity<Void> promoteMembers(@PathVariable Long id) {
        memberService.promoteMember(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/demote")
    public ResponseEntity<Void> demoteMembers(@PathVariable Long id) {
        memberService.demoteMember(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/regularize")
    public ResponseEntity<Void> regularizeMember(@PathVariable Long id) {
        memberService.regularizeMember(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sort-by-id")
    public ResponseEntity<Void> sortMembersByStudentID() {
        memberService.sortMembersByStudentID(memberService.getAllMembers());
        return ResponseEntity.noContent().build();
    }
}

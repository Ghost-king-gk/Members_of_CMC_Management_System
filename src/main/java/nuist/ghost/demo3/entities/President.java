package nuist.ghost.demo3.entities;


public class President extends Member {
    public President() {
    }


    public President(String name, String studentID) {
        super(name, studentID);
    }


    @Override
    public String getMemberType() {
        return "President";
    }
}

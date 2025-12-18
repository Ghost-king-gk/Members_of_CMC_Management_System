package nuist.ghost.demo3.utils;
/**
 * @discription 快速排序  A quick sort based on ID for a practice of algorithm
 * @author Xuyang Zhou
 *
 */

import java.util.ArrayList;
import java.util.List;
import nuist.ghost.demo3.entities.Member;

public class SortUtils {
    private SortUtils(){
    }

    public static List<Member> quickSortByID(List<Member> list) {

        if (list == null || list.size() <= 1) {
            return list;
        }

        long first = list.get(0).getId();
        long middle = list.get(list.size() / 2).getId();
        long last = list.get(list.size() - 1).getId();
        long baselineID = calculateMedian(first, middle, last);

        List<Member> lessThanBaseline = new ArrayList<>();
        List<Member> equalToBaseline = new ArrayList<>();
        List<Member> greaterThanBaseline = new ArrayList<>();

        for(Member m : list){
            if(m.getId() < baselineID){
                lessThanBaseline.add(m);
            } else if(m.getId() > baselineID){
                greaterThanBaseline.add(m);
            } else {
                equalToBaseline.add(m);
            }
        }
        
        List<Member> sortedLess = quickSortByID(lessThanBaseline);
        List<Member> sortedGreater = quickSortByID(greaterThanBaseline);

        List<Member> result = new ArrayList<>();

        result.addAll(sortedLess);
        result.addAll(equalToBaseline);
        result.addAll(sortedGreater);

        return result;
    }

    private static long calculateMedian(long a, long b, long c) {
        if ((a > b) != (a > c)) {
            return a;
        } else if ((b > a) != (b > c)) {
            return b;
        } else {
            return c;
        }
    }
}

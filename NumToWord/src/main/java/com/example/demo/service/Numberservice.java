package com.example.demo.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

@Service
public class Numberservice {
	
	public static String numToString(int num) {
		
        HashMap<Integer, String> map = new HashMap<>();
        map.put(0, "Zero");
        map.put(1, "One");
        map.put(2, "Two");
        map.put(3, "Three");
        map.put(4, "Four");
        map.put(5, "Five");
        map.put(6, "Six");
        map.put(7, "Seven");
        map.put(8, "Eight");
        map.put(9, "Nine");
        map.put(10, "Ten");
        map.put(11, "Eleven");
        map.put(12, "Twelve");
        map.put(13, "Thirteen");
        map.put(14, "Fourteen");
        map.put(15, "Fifteen");
        map.put(16, "Sixteen");
        map.put(17, "Seventeen");
        map.put(18, "Eighteen");
        map.put(19, "Nineteen");
        map.put(20, "Twenty");
        map.put(30, "Thirty");
        map.put(40, "Forty");
        map.put(50, "Fifty");
        map.put(60, "Sixty");
        map.put(70, "Seventy");
        map.put(80, "Eighty");
        map.put(90, "Ninety");
        map.put(100, "Hundred");
        map.put(1000, "Thousand");
        map.put(100000, "Lakh");
        map.put(10000000, "Crore");

        String value = String.valueOf(num);
        int len = value.length();
        String result = "";

        switch (len) {
            case 1:
                result = map.get(num);
                break;

            case 2:
                if (num <= 20) {
                    result = map.get(num);
                } else {
                    result = map.get(Character.getNumericValue(value.charAt(0)) * 10)
                            + " " + map.get(Character.getNumericValue(value.charAt(1)));
                }
                break;

            case 3:
                if (value.substring(1).equals("00")) {
                    result = map.get(Character.getNumericValue(value.charAt(0))) + " " + map.get(100);
                } else {
                    result = map.get(Character.getNumericValue(value.charAt(0))) + " " + map.get(100) + " ";
                    int lastTwo = num % 100;
                    if (lastTwo <= 20) {
                        result += map.get(lastTwo);
                    } else {
                        result += map.get(Character.getNumericValue(value.charAt(1)) * 10)
                                + " " + map.get(Character.getNumericValue(value.charAt(2)));
                    }
                }
                break;

            case 4:
                result = map.get(Character.getNumericValue(value.charAt(0))) + " " + map.get(1000) + " ";
                int lastThree = Integer.parseInt(value.substring(1));
                if (lastThree != 0) {
                    result += numToString(lastThree);
                }
                break;

            case 5:
                int firstTwo = Integer.parseInt(value.substring(0, 2));
                if (firstTwo <= 20) {
                    result = map.get(firstTwo) + " " + map.get(1000) + " ";
                } else {
                    result = map.get(Character.getNumericValue(value.charAt(0)) * 10)
                            + " " + map.get(Character.getNumericValue(value.charAt(1))) + " " + map.get(1000) + " ";
                }
                int lastThreeDigits = Integer.parseInt(value.substring(2));
                if (lastThreeDigits != 0) {
                    result += numToString(lastThreeDigits);
                }
                break;

            case 6:
                result = map.get(Character.getNumericValue(value.charAt(0))) + " " + map.get(100000) + " ";
                int lastFive = Integer.parseInt(value.substring(1));
                if (lastFive != 0) {
                    result += numToString(lastFive);
                }
                break;

            case 7:
                int firstTwoLakhs = Integer.parseInt(value.substring(0, 2));
                if (firstTwoLakhs <= 20) {
                    result = map.get(firstTwoLakhs) + " " + map.get(100000) + " ";
                } else {
                    result = map.get(Character.getNumericValue(value.charAt(0)) * 10)
                            + " " + map.get(Character.getNumericValue(value.charAt(1))) + " " + map.get(100000) + " ";
                }
                int lastFiveDigits = Integer.parseInt(value.substring(2));
                if (lastFiveDigits != 0) {
                    result += numToString(lastFiveDigits);
                }
                break;

            case 8:
                result = map.get(Character.getNumericValue(value.charAt(0))) + " " + map.get(10000000) + " ";
                int lastSeven = Integer.parseInt(value.substring(1));
                if (lastSeven != 0) {
                    result += numToString(lastSeven);
                }
                break;

            case 9:
                int firstTwoCrores = Integer.parseInt(value.substring(0, 2));
                if (firstTwoCrores <= 20) {
                    result = map.get(firstTwoCrores) + " " + map.get(10000000) + " ";
                } else {
                    result = map.get(Character.getNumericValue(value.charAt(0)) * 10)
                            + " " + map.get(Character.getNumericValue(value.charAt(1))) + " " + map.get(10000000) + " ";
                }
                int lastSevenDigits = Integer.parseInt(value.substring(2));
                if (lastSevenDigits != 0) {
                    result += numToString(lastSevenDigits);
                }
                break;

            default:
                result = "Number too large to convert!";
                break;
        }

        return result.trim();
    }

}

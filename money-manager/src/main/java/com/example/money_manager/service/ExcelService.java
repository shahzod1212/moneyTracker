package com.example.money_manager.service;

import com.example.money_manager.dtos.ExpenseDto;
import com.example.money_manager.dtos.IncomeDto;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.w3c.dom.stylesheets.LinkStyle;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.stream.IntStream;

@Service
public class ExcelService {

    public void writeIncomesToExcel(OutputStream outputStream, List<IncomeDto> incomes) throws IOException {
        try(Workbook workbook = new XSSFWorkbook()){
            Sheet sheet = workbook.createSheet("Incomes");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("S.No");
            row.createCell(1).setCellValue("Name");
            row.createCell(2).setCellValue("Category");
            row.createCell(3).setCellValue("Amount");
            row.createCell(4).setCellValue("Date");
            IntStream.range(0,incomes.size())
                    .forEach(i ->{
                        IncomeDto incomeDto = incomes.get(i);
                        Row row1  = sheet.createRow(i+1);
                        row.createCell(0).setCellValue(i+1);
                        row.createCell(1).setCellValue(incomeDto.getName()!=null ? incomeDto.getName():"N/A");
                        row.createCell(2).setCellValue(incomeDto.getCategory().getId()!=null ? incomeDto.getName():"N/A");
                        row.createCell(3).setCellValue(incomeDto.getAmount()!=null ? incomeDto.getName():"N/A");
                        row.createCell(4).setCellValue(incomeDto.getDate()!=null ? incomeDto.getName():"N/A");
                    });
            workbook.write(outputStream);
        }
    }
    public void writeExpenseToExcel(OutputStream outputStream, List<ExpenseDto> incomes) throws IOException {
        try(Workbook workbook = new XSSFWorkbook()){
            Sheet sheet = workbook.createSheet("Expense");
            Row row = sheet.createRow(0);
            row.createCell(0).setCellValue("S.No");
            row.createCell(1).setCellValue("Name");
            row.createCell(2).setCellValue("Category");
            row.createCell(3).setCellValue("Amount");
            row.createCell(4).setCellValue("Date");
            IntStream.range(0,incomes.size())
                    .forEach(i ->{
                        ExpenseDto incomeDto = incomes.get(i);
                        Row row1  = sheet.createRow(i+1);
                        row.createCell(0).setCellValue(i+1);
                        row.createCell(1).setCellValue(incomeDto.getName()!=null ? incomeDto.getName():"N/A");
                        row.createCell(2).setCellValue(incomeDto.getCategory().getId()!=null ? incomeDto.getName():"N/A");
                        row.createCell(3).setCellValue(incomeDto.getAmount()!=null ? incomeDto.getName():"N/A");
                        row.createCell(4).setCellValue(incomeDto.getDate()!=null ? incomeDto.getName():"N/A");
                    });
            workbook.write(outputStream);
        }
    }
}

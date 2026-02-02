import { RefundRuleFactory } from "./refund_rule_factory";
import { FullRefund } from "./full_refund";
import { PartialRefund } from "./partial_refund";
import { NoRefund } from "./no_refund copy";

describe("RefundRuleFactory", () => {
    it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência", () => {
        const refundRule = RefundRuleFactory.getRefundRule(8);
        expect(refundRule).toBeInstanceOf(FullRefund);

        const refundRule10Days = RefundRuleFactory.getRefundRule(10);
        expect(refundRule10Days).toBeInstanceOf(FullRefund);

        const refundRule30Days = RefundRuleFactory.getRefundRule(30);
        expect(refundRule30Days).toBeInstanceOf(FullRefund);
    });

    it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência", () => {
        const refundRule7Days = RefundRuleFactory.getRefundRule(7);
        expect(refundRule7Days).toBeInstanceOf(PartialRefund);

        const refundRule1Day = RefundRuleFactory.getRefundRule(1);
        expect(refundRule1Day).toBeInstanceOf(PartialRefund);

        const refundRule4Days = RefundRuleFactory.getRefundRule(4);
        expect(refundRule4Days).toBeInstanceOf(PartialRefund);
    });

    it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência", () => {
        const refundRule0Days = RefundRuleFactory.getRefundRule(0);
        expect(refundRule0Days).toBeInstanceOf(NoRefund);

        const refundRuleNegative = RefundRuleFactory.getRefundRule(-1);
        expect(refundRuleNegative).toBeInstanceOf(NoRefund);
    });
});
